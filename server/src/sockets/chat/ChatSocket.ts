import { Server, Socket } from "socket.io";
import { ChatMessageService } from "../../services/chat-room/ChatMessageService.js";
import prisma from "../../lib/prisma.js";
export class ChatSocket {
  constructor(
    private readonly io: Server,
    private readonly chatMessageService: ChatMessageService,
  ) {}

  public initialize() {
    this.io.on("connection", async (socket: Socket) => {
      console.log("User connected:", socket.id);

      const userId = socket.data.userId;

      // entra na sala do usuário para notificações da Home
      socket.join(userId);

      this.registerEvents(socket);
    });
  }

  private registerEvents(socket: Socket) {
    socket.on("join_room", (roomId: string) =>
      this.handleJoinRoom(socket)(roomId),
    );

    socket.on("leave_room", (roomId: string) => {
      socket.leave(roomId);
    });

    socket.on("send_message", (data: any) =>
      this.handleSendMessage(socket)(data),
    );

    socket.on("mark_as_read", (data: any) =>
      this.handleSaveLastMessageRead(socket)(data),
    );

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  }

  private handleJoinRoom(socket: Socket) {
    return async (roomId: string) => {
      try {
        const userId = socket.data.userId;

        ///valida userId
        await this.chatMessageService.isUserInRoom({
          roomId,
          userId,
        });

        socket.join(roomId);
      } catch (error) {
        socket.emit("join_error", "Você não pertence a essa sala");
      }
    };
  }

  private handleSendMessage(socket: Socket) {
    return async (data: any) => {
      const { roomId, type, content, tempId } = data;

      // Debug: Quantas pessoas estão ouvindo nesta sala agora?
      const connectedSockets = await this.io.in(roomId).fetchSockets();
      console.log(
        `Sala ${roomId} tem ${connectedSockets.length} usuários conectados.`,
      );

      const userId = socket.data.userId;

      try {
        ///valida userId
        await this.chatMessageService.isUserInRoom({
          roomId,
          userId,
        });

        const savedMessage = await this.chatMessageService.createMessage({
          roomId,
          userId,
          type,
          content,
        });

        //atualiza lastMessageRead
        const lastMessageReadString = new Date();
        await this.chatMessageService.updateLastMessageRead(
          roomId,
          userId,
          lastMessageReadString,
        );

        //Atualiza quem está dentro da sala - envia a mensagem para todos os usuários que deram socket.join(roomId)
        this.io.to(roomId).emit("receive_message", {
          ...savedMessage,
          tempId,
        });

        //Atualiza Home dos membros
        const members = await this.chatMessageService.getRoomMembers(roomId);

        //emito um evento enviando a mensagem criada
        members.forEach(({ userId }) => {
          this.io.to(userId).emit("room_updated", {
            roomId,
            messageType: savedMessage.messageType,
            lastMessage: savedMessage.content,
            createdAt: savedMessage.createdAt,
            name: savedMessage.user.name,
          });
        });
      } catch (error) {
        socket.emit("message_error", {
          tempId,
          error: "Erro ao enviar mensagem",
        });
      }
    };
  }

  private handleSaveLastMessageRead(socket: Socket) {
    return async (data: any) => {
      const { roomId, lastReadAt } = data;
      const userId = socket.data.userId;

      const dateObj = new Date(lastReadAt); //garante tipo Date

      const result = await this.chatMessageService.updateLastMessageRead(
        roomId,
        userId,
        dateObj,
      );

      //atualiza COUNT message unread depois que ele leu e HOME escuta
      this.io.to(userId).emit("update_read_message", {
        result,
      });
    };
  }
}
