import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth/authRoutes";
import userRoutes from "./routes/user/userRoutes";
import chatRoomRoutes from "./routes/chat-room/chatRoomRoutes";
import uploadRoutes from "./routes/upload/uploadRoutes";
import searchRoutes from "./routes/search/searchRoutes";

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
