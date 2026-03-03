import prisma from "../../lib/prisma.js";

interface ICreateMessageProps {
  roomId: string;
  userId: string;
  type: string;
  content: string;
}

export class ChatMessageService {
  async createMessage({ roomId, userId, type, content }: ICreateMessageProps) {
    await this.isUserInRoom({ roomId, userId });

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
}
