import prisma from "../../lib/prisma";

export class SearchService {
  search = async (textSearch: string) => {
    const groups = await prisma.chatRoom.findMany({
      where: {
        name: {
          contains: textSearch,
          mode: "insensitive",
        },
      },
    });

    return groups;
  };
}
