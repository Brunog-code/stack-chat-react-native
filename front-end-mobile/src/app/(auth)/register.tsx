import { theme } from "@/src/constants/theme";
import { useRouter } from "expo-router";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Text,
  View,
} from "react-native";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/src/schemas/registerSchema";
import { useForm, Controller } from "react-hook-form";
import { api } from "@/src/lib/api";
import { IUser } from "@/src/types";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { getApiError } from "@/src/utils/get-api-error";
import { Logo } from "@/src/components/Logo";

const { width } = Dimensions.get("window");

export default function RegisterScreen() {
  const [loadingRegister, setLoadingRegister] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function handleRegister(data: RegisterFormData) {
    try {
      setLoadingRegister(true);

      await api.post<IUser>("/user/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      Toast.show({
        type: "success",
        text1: "Cadastrado com sucesso!",
      });

      router.push("/(auth)/login");
    } catch (error: any) {
      console.log(error);

      Toast.show({
        type: "error",
        text1: getApiError(error),
      });
    } finally {
      setLoadingRegister(false);
    }
  }

  return (
    <KeyboardAvoidingView className="flex-1 relative" behavior={"padding"}>
      <View className="flex-1 items-center justify-center gap-6">
        <View className="absolute top-0 left-0 right-0 items-center">
          <View
            style={{
              width: width,
              height: width * 0.5,
              backgroundColor: theme.colors.purple,
              borderBottomLeftRadius: width,
              borderBottomRightRadius: width,
              opacity: 0.5,
            }}
          />
        </View>

        <View className="items-center">
              <Logo />
          <Text className="text-text text-xl font-roboto">
            Conecte-se à comunidade dev
          </Text>
        </View>

        <View className="w-[80%] gap-1">
          {/* Nome */}
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Nome"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                style={{ backgroundColor: "#24304A" }}
                outlineColor="#4b5563"
                activeOutlineColor="#8B5CF6"
                textColor="#ffffff"
                placeholderTextColor="#9ca3af"
                theme={{ roundness: 8 }}
              />
            )}
          />
          {errors.name && (
            <Text className="text-red-500">{errors.name.message}</Text>
          )}

          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Email"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                keyboardType="email-address"
                style={{ backgroundColor: "#24304A" }}
                outlineColor="#4b5563"
                activeOutlineColor="#8B5CF6"
                textColor="#ffffff"
                placeholderTextColor="#9ca3af"
                theme={{ roundness: 8 }}
              />
            )}
          />
          {errors.email && (
            <Text className="text-red-500">{errors.email.message}</Text>
          )}

          {/* Senha */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Senha"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                secureTextEntry
                style={{ backgroundColor: "#24304A" }}
                outlineColor="#4b5563"
                activeOutlineColor="#8B5CF6"
                textColor="#ffffff"
                placeholderTextColor="#9ca3af"
                theme={{ roundness: 8 }}
              />
            )}
          />
          {errors.password && (
            <Text className="text-red-500">{errors.password.message}</Text>
          )}

          {/* Confirmar Senha */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Confirme a senha"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                secureTextEntry
                style={{ backgroundColor: "#24304A" }}
                outlineColor="#4b5563"
                activeOutlineColor="#8B5CF6"
                textColor="#ffffff"
                placeholderTextColor="#9ca3af"
                theme={{ roundness: 8 }}
              />
            )}
          />
          {errors.confirmPassword && (
            <Text className="text-red-500">
              {errors.confirmPassword.message}
            </Text>
          )}

          {/* Botão */}

          <Button
            mode="contained"
            onPress={handleSubmit(handleRegister)}
            buttonColor={theme.colors.purple}
            textColor={
              loadingRegister ? theme.colors.details_bg : theme.colors.text
            }
            style={{
              height: 50,
              borderRadius: 12,
              justifyContent: "center",
              marginTop: 10,
              backgroundColor: theme.colors.purple, // força via style
              opacity: loadingRegister ? 0.6 : 1,
            }}
            labelStyle={{ fontSize: 20, fontWeight: "bold" }}
            disabled={loadingRegister}
            icon={
              loadingRegister
                ? () => (
                    <ActivityIndicator
                      color={theme.colors.details_bg}
                      size={18}
                    />
                  )
                : undefined
            }
          >
            {loadingRegister ? "Cadastrando..." : "Cadastrar"}
          </Button>

          <View className="items-center justify-center mt-6 gap-4">
            <Text className="text-text text-lx">
              Já possui uma conta?{" "}
              <Text
                className="text-purple font-bold"
                onPress={() => router.push("/login")}
              >
                Faça login
              </Text>
            </Text>
          </View>
        </View>
      </View>

      <Image
        source={require("./../../../assets/images/logo.png")}
        className="w-[250px] h-[250px] absolute -bottom-20 -right-20 opacity-30 -rotate-45"
      />
    </KeyboardAvoidingView>
  );
}
