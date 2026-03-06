import { io, Socket } from "socket.io-client";

let socket: Socket;

export function getSocket() {
  if (!socket) {
    socket = io(process.env.EXPO_PUBLIC_BASE_URL as string, {
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
