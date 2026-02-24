import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface Payload {
  sub: string;
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authToken.split(" ")[1];

  try {
    const { sub } = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as Payload;

    req.user_id = sub;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido " });
  }
}
