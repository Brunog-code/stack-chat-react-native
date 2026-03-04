import { compare } from "bcryptjs";
import prisma from "../../lib/prisma.js";
import { generateToken } from "../../lib/jwt-generate-token.js";

interface IAuthServiceLoginProps {
  email: string;
  password: string;
}

interface IAuthServiceGetMeProps {
  id: string;
}

export class AuthService {
  login = async ({ email, password }: IAuthServiceLoginProps) => {
    //se existe usuario
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !user.isActive) {
      throw new Error("Usuário não cadastrado");
    }

    //se senha está correta
    const passwordHash = await compare(password, user.password);
    if (!passwordHash) {
      throw new Error("Dados inválidos");
    }

    //gerar o token
    const token = generateToken(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      token: token,
    };
  };

  getMe = async ({ id }: IAuthServiceGetMeProps) => {
    const user = await prisma.user.findUnique({
      where: {
        id,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        image: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) throw new Error("Usuário não encontrado");

    return user;
  };
}
