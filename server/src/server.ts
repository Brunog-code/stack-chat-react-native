import { createServer } from "node:http";
import { Server } from "socket.io";
import app from "./app.js";
import { ChatMessageService } from "./services/chat-room/ChatMessageService.js";
import { ChatSocket } from "./sockets/chat/ChatSocket.js";
import { socketAuthMiddleware } from "./middlewares/socket-auth-middleware.js";

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
