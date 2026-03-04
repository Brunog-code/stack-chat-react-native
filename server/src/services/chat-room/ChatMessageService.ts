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
    console.log(messageCreated);

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
}
