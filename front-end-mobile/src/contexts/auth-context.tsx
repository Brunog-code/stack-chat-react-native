import { createContext, useContext, useEffect, useState } from "react";
import { ILoginResponse, IUser } from "../types";
import { api } from "../lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SplashScreen } from "expo-router";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextData {
  user: IUser | null;
  loadingUser: boolean;
  login: (email: string, password: string) => Promise<string>;
  logout: () => Promise<void>;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    async function loadData() {
      await loadStorageData();
    }

    loadData();
  }, []);

  async function loadStorageData() {
    try {
      setLoadingUser(true);

      const storageUser = await AsyncStorage.getItem("@user:stackchat");
      const token = await AsyncStorage.getItem("@token:stackchat");

      if (!storageUser || !token) {
        setUser(null);
        return;
      }

      //Usa o user do storage imediatamente
      const parsedUser = JSON.parse(storageUser);
      setUser(parsedUser);

      //valida o token na api e pega dados atualizados do user
      const response = await api.get<IUser>("/auth/me");

      //seta o user com dados frescos da api
      setUser(response.data);
      await AsyncStorage.setItem(
        "@user:stackchat",
        JSON.stringify(response.data),
      );
    } catch (error) {
      console.log(error);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }

  async function login(email: string, password: string) {
    const response = await api.post<ILoginResponse>("/auth/login", {
      email,
      password,
    });

    const { message } = response.data;
    const { token, ...userData } = response.data.session;

    await AsyncStorage.setItem("@token:stackchat", token);
    await AsyncStorage.setItem("@user:stackchat", JSON.stringify(userData));

    setUser(userData);

    return message;
  }

  async function logout() {
    await AsyncStorage.removeItem("@token:stackchat");
    await AsyncStorage.removeItem("@user:stackchat");
    setUser(null);
  }

  return (
    <AuthContext value={{ user, login, logout, loadingUser }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Contexto não encontrado");

  return context;
}
