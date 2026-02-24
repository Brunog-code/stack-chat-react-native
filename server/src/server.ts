import { createServer } from "node:http";
import { Server } from "socket.io";
import app from "./app.js";
import { chatSocket } from "./sockets/chat.js";

//cria servidor HTTP
const server = createServer(app);

//cria socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// registra o chat
chatSocket(io);

//iniciando server
const PORT = 3333;
server.listen(PORT, () => console.log(`server is running at port ${PORT}`));
