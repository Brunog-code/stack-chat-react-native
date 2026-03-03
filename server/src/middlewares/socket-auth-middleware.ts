import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

interface Payload {
  sub: string;
}

export function socketAuthMiddleware(socket: Socket, next: any) {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Token não fornecido"));
  }

  try {
    const { sub } = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as Payload;

    socket.data.userId = sub;

    return next();
  } catch (error) {
    return next(new Error("Token inválido"));
  }
}
