import prisma from "../../lib/prisma.js";
import { hash } from "bcryptjs";

interface IUserServiceProps {
  name: string;
  email: string;
  password: string;
}

export class UserService {
  register = async ({ email, name, password }: IUserServiceProps) => {
    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userAlreadyExists) {
      throw new Error("Usuário já cadastrado");
    }

    const passwordHash = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    //buscar todas as salas
    const rooms = await prisma.chatRoom.findMany({
      select: { id: true },
    });

    //incluir o user
    await prisma.chatMember.createMany({
      data: rooms.map((room) => ({
        userId: user.id,
        chatRoomId: room.id,
        role: "member",
        lastReadAt: null,
      })),
    });

    return user;
  };

  updateName = async (id: string, name: string) => {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new Error("Usuário não encontrado");

    const nameSaved = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    return nameSaved;
  };

  updateImage = async (id: string, urlImage: string) => {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new Error("Usuário não encontrado");

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        image: urlImage,
      },
    });
  };
}
