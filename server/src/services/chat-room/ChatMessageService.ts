import prisma from "../../lib/prisma.js";

interface ICreateMessageProps {
  roomId: string;
  userId: string;
  type: string;
  content: string;
}

export class ChatMessageService {
  async createMessage({ roomId, userId, type, content }: ICreateMessageProps) {
    const messageCreated = await prisma.message.create({
      data: {
        chatRoomId: roomId,
        userId: userId,
        content: type == "text" ? content : null,
        imageUrl: type !== "text" ? content : null,
        messageType: type,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return messageCreated;
  }

  async isUserInRoom({
    roomId,
    userId,
  }: Pick<ICreateMessageProps, "roomId" | "userId">) {
    const userInRoom = await prisma.chatMember.findFirst({
      where: {
        chatRoomId: roomId,
        userId: userId,
      },
    });

    if (!userInRoom) throw new Error("Usuário não pertence ao chat");
  }

  async getRoomMembers(roomId: string) {
    const members = await prisma.chatMember.findMany({
      where: {
        chatRoomId: roomId,
      },
      select: {
        userId: true,
      },
    });
    return members;
  }

  async updateLastMessageRead(
    roomId: string,
    userId: string,
    lastReadAt: Date,
  ) {
    const member = await prisma.chatMember.findFirst({
      where: {
        userId,
        chatRoomId: roomId,
      },
      select: {
        lastReadAt: true,
        id: true,
      },
    });

    if (!member) throw new Error("Membro não pertence a sala");

    if (member.lastReadAt !== null && member.lastReadAt >= lastReadAt) return;

    //update dateTime las message read
    await prisma.chatMember.update({
      where: {
        id: member.id,
      },
      data: {
        lastReadAt,
      },
    });

    const unreadCount = await prisma.message.count({
      where: {
        chatRoomId: roomId,
        createdAt: { gt: lastReadAt },
        userId: { not: userId }, //ignora mensagens do próprio usuário
      },
    });

    return unreadCount;
  }
}
