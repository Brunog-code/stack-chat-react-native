import { ChatRoomService } from "../../services/chat-room/chatRoomService.js";
import { Request, Response } from "express";

export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  getAllChatRooms = async (req: Request, res: Response) => {
    const { user_id } = req.query;

    if (!user_id) throw new Error("Id é obrgatório");

    try {
      const response = await this.chatRoomService.getAllChatRooms({
        user_id: user_id as string,
      });

      res.status(200).json(response);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  };

  getMessagesByRoom = async (req: Request, res: Response) => {
    const { roomId, userId } = req.query;

    if (!roomId || !userId) throw new Error("ID e Usuário são obrigatórios");

    try {
      const messagesRoom = await this.chatRoomService.getMessagesByRoom(
        String(roomId),
        String(userId),
      );

      return res.json(messagesRoom);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  };
}
