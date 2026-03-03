import { Router } from "express";

import { authenticateToken } from "../../middlewares/authenticate-token.js";
import { ChatRoomController } from "../../controllers/chat-room/ChatRoomController.js";
import { ChatRoomService } from "../../services/chat-room/ChatRoomService.js";

const router = Router();

//1-instancia controler e injeta service
const chatRoomService = new ChatRoomService();
const chatRoomController = new ChatRoomController(chatRoomService);

router.get("/", authenticateToken, chatRoomController.getAllChatRooms);
router.get(
  "/messages",
  authenticateToken,
  chatRoomController.getMessagesByRoom,
);

export default router;
