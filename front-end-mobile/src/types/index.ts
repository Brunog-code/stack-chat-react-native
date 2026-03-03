export interface IUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  image?: string;
}

export interface ILoginResponse {
  message: string;
  session: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    image?: string;
    token: string;
  };
}

export interface IResponseDataRooms {
  id: string;
  name: string;
  description?: string | null;
  isPrivate: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;

  // Últimas mensagens (ou mensagens retornadas)
  messages: {
    id: string;
    chatRoomId: string;
    userId: string;
    content?: string | null;
    imageUrl?: string | null;
    messageType: "text" | "image";
    createdAt: string;

    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      createdAt: string;
      updatedAt: string;
    };
  }[];

  // Membros da sala
  members: {
    id: string;
    userId: string;
    chatRoomId: string;
    role: "admin" | "member";
    lastReadAt: string | null;
    joinedAt: string;
  }[];

  // Quantidade de mensagens não lidas
  unreadCount: number;
}

export interface IMessage {
  id: string;
  chatRoomId: string;
  userId: string;
  content: string;
  imageUrl: string;
  messageType: "text" | "image" | "video";
  createdAt: string;
  user: {
    name: string;
    image?: string | null;
  };
  sending?: boolean; // 👈 para optimistic update
}

export interface IResponseMessageRoom {
  messages: IMessage[];
  lastReadMessageId: string;
}
