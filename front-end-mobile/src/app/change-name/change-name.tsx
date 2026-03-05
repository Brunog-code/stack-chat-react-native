import { theme } from "@/src/constants/theme";
import { useAuth } from "@/src/contexts/auth-context";
import { api } from "@/src/lib/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function ChangeName() {
  const insets = useSafeAreaInsets();
  const { name, id } = useLocalSearchParams<{ name: string; id: string }>();

  const { setUser } = useAuth();

  const router = useRouter();

  const [loadingSaveName, setLoadingSaveName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(name);

  async function handleUpdateName() {
    if (nameInput.trim().length < 3) {
      Toast.show({
        type: "error",
        text1: "Nome precisa ter no minimo 3 letras",
      });
      return;
    }
    try {
      setLoadingSaveName(true);

      await api.patch(`/user/update-name/${id}`, {
        name: nameInput,
      });

      //atualiza o context
      setUser((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          name: nameInput,
        };
      });

      Toast.show({
        type: "success",
        text1: "Nome salvo",
      });

      router.back();
    } catch (error) {
      console.error(error);

      Toast.show({
        type: "error",
        text1: "Erro ao atualizar o nome",
      });
    } finally {
      setLoadingSaveName(false);
    }
  }

  return (
    <View
      className="flex-1 justify-between"
      style={{
        backgroundColor: theme.colors.background,
        paddingTop: insets.top,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
        paddingBottom: insets.bottom + 20,
      }}
    >
      <View className="gap-6">
        <TextInput
          style={{
            backgroundColor: theme.colors.details_bg,
            marginTop: 30,
          }}
          outlineColor={theme.colors.gray}
          textColor={theme.colors.text}
          activeOutlineColor={theme.colors.purple}
          value={nameInput}
          onChangeText={setNameInput}
        />
        <Text className="text-text text-2xl">
          Esse nome será exibido para as pessoas com quem você conversar que não
          tem seu número salvo nos contatos.
        </Text>
      </View>

      <Button
        mode="contained"
        onPress={handleUpdateName}
        buttonColor={theme.colors.purple}
        textColor={
          loadingSaveName ? theme.colors.details_bg : theme.colors.text
        }
        style={{
          height: 50,
          borderRadius: 12,
          justifyContent: "center",
          marginTop: 10,
          backgroundColor: theme.colors.purple, // força via style
          opacity: loadingSaveName ? 0.6 : 1,
        }}
        labelStyle={{ fontSize: 20, fontWeight: "bold" }}
        disabled={loadingSaveName}
        icon={
          loadingSaveName
            ? () => (
                <ActivityIndicator color={theme.colors.details_bg} size={18} />
              )
            : undefined
        }
      >
        {loadingSaveName ? "Salvando..." : "Salvar"}
      </Button>
    </View>
  );
}
