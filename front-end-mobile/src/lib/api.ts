import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.3.135:3333",
  timeout: 12000,
  headers: {
    "Content-Type": "application/json",
  },
});

//interceptor para add o token em toda req
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("@token:stackchat");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

//intercepta response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status == 401) {
      await AsyncStorage.multiRemove(["@token:stackchat", "@user:stackchat"]);
    }

    return Promise.reject(error);
  },
);
