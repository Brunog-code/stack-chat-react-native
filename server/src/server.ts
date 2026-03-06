import { createServer } from "node:http";
import { Server } from "socket.io";
import app from "./app";
import { ChatMessageService } from "./services/chat-room/ChatMessageService";
import { ChatSocket } from "./sockets/chat/ChatSocket";
import { socketAuthMiddleware } from "./middlewares/socket-auth-middleware";

//cria servidor HTTP
const server = createServer(app);

//cria socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

//midleware de auth do socket
io.use(socketAuthMiddleware);

// registra o chat
const chatMessageService = new ChatMessageService();
const chatSocket = new ChatSocket(io, chatMessageService);

chatSocket.initialize();

//iniciando server
const PORT = 3333;
server.listen(PORT, () => console.log(`server is running at port ${PORT}`));
