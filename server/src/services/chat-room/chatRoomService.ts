import prisma from "../../lib/prisma.js";

interface IChatRoomServiceProps {
  user_id: string;
}

export class ChatRoomService {
  getAllChatRooms = async ({ user_id }: IChatRoomServiceProps) => {
    const roomsData = await prisma.chatRoom.findMany({
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        members: {
          where: { userId: user_id },
        },
      },
    });

    //Conta mensagens não lidas por sala
    const roonsWithUnread = await Promise.all(
      roomsData.map(async (room) => {
        const member = room.members[0];
        const lastReadAt = member?.lastReadAt ?? new Date(0); //se nunca leu, conta tudo

        console.log('ultima lida qtde ', lastReadAt);

        const unreadCount = await prisma.message.count({
          where: {
            chatRoomId: room.id,
            createdAt: { gt: lastReadAt },
            userId: { not: user_id },
          },
        });

        return { ...room, unreadCount };
      }),
    );

    return roonsWithUnread;
  };

  getMessagesByRoom = async (roomId: string, userId: string) => {
    const member = await prisma.chatMember.findUnique({
      where: {
        userId_chatRoomId: {
          userId,
          chatRoomId: roomId,
        },
      },
    });

    //Busca as últimas 100 mensagens
    const messages = await prisma.message.findMany({
      where: { chatRoomId: roomId },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    //Encontra o horario da última mensagem lida
    const lastReadAt = member?.lastReadAt;

    //Pega a última mensagem com createdAt <= lastReadAt
    //se tiver lastReadAt retorno id dela, se nao tiver retorna o id do index 0
    const lastRead = lastReadAt
      ? messages.find((m) => m.createdAt <= lastReadAt)
      : null;

    const lastReadMessageId = lastRead?.id ?? null;

    return { messages, lastReadMessageId };
  };
}
