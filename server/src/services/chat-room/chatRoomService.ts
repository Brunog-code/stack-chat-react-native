import prisma from "../../lib/prisma.js";

export class ChatRoomService {
    
  getAllChatRooms = async () => {
    const roomsData = await prisma.chatRoom.findMany({
      include: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          include: {
            user: true,
          },
        },
      },
    });

    return roomsData;
  };
}
