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
        role: 'member'
      })),
    });

    return user;
  };
}
