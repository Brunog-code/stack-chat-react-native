import { Router } from "express";

import { authenticateToken } from "../../middlewares/authenticate-token";
import { ChatRoomController } from "../../controllers/chat-room/ChatRoomController";
import { ChatRoomService } from "../../services/chat-room/ChatRoomService";

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
