import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth/authRoutes.js";
import userRoutes from "./routes/user/userRoutes.js";
import chatRoomRoutes from "./routes/chat-room/chatRoomRoutes.js";
import uploadRoutes from "./routes/upload/uploadRoutes.js";
import searchRoutes from "./routes/search/searchRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());

// rotas
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/chat-room", chatRoomRoutes);
app.use("/upload", uploadRoutes);
app.use("/search-group", searchRoutes);

export default app;
