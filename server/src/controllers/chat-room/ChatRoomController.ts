import { ChatRoomService } from "../../services/chat-room/chatRoomService.js";
import { Request, Response } from "express";

export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  getAllChatRooms = async (req: Request, res: Response) => {
    try {
      const response = await this.chatRoomService.getAllChatRooms();

      res.status(200).json(response);
    } catch (error) {
      console.error(error); 

      return res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  };
}
