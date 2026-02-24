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
}
