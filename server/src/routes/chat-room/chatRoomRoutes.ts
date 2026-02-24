import { Router } from "express";

import { authenticateToken } from "../../middlewares/authenticate-token.js";
import { ChatRoomController } from "../../controllers/chat-room/ChatRoomController.js";
import { ChatRoomService } from "../../services/chat-room/chatRoomService.js";

const router = Router();

//1-instancia controler e injeta service
const chatRoomService = new ChatRoomService();
const chatRoomController = new ChatRoomController(chatRoomService);

router.get("/", authenticateToken, chatRoomController.getAllChatRooms);

export default router;
