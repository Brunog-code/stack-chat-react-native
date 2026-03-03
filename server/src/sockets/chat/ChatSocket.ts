import { Server, Socket } from "socket.io";
import { ChatMessageService } from "../../services/chat-room/ChatMessageService.js";
export class ChatSocket {
  constructor(
    private readonly io: Server,
    private readonly chatMessageService: ChatMessageService,
  ) {}

  public initialize() {
    this.io.on("connection", (socket: Socket) => {
      console.log("User connected:", socket.id);

      this.registerEvents(socket);
    });
  }

  private registerEvents(socket: Socket) {
    socket.on("join_room", this.handleJoinRoom(socket));
    socket.on("send_message", this.handleSendMessage(socket));
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

        this.io.to(roomId).emit("receive_message", {
          ...savedMessage,
          tempId,
        });
      } catch (error) {
        socket.emit("message_error", {
          tempId,
          error: "Erro ao enviar mensagem",
        });
      }
    };
  }
}
