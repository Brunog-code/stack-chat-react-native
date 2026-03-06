import { io, Socket } from "socket.io-client";

let socket: Socket;

export function getSocket() {
  if (!socket) {
    socket = io("http://192.168.3.135:3334", {
      autoConnect: false,
    });
  }

  return socket;
}

export async function connectSocket(token: string) {
  const socket = getSocket();

  socket.auth = { token };
  socket.connect();
}

export async function disconnectSocket() {
  if (socket) {
    socket.disconnect();
  }
}
