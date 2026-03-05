import { Logo } from "@/src/components/Logo";
import { theme } from "@/src/constants/theme";
import { useAuth } from "@/src/contexts/auth-context";
import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import { ActivityIndicator, Avatar } from "react-native-paper";
import avatarImage from "../../../assets/images/avatar-user.png";
import { useCallback, useState } from "react";
import Toast from "react-native-toast-message";
import { getApiError } from "@/src/utils/get-api-error";
import { api } from "@/src/lib/api";
import { IUser } from "@/src/types";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();

  const router = useRouter();

  const { logout, user } = useAuth();

  const [imageUser, setImageUser] = useState<string>("");
  const [nameUser, setNameUser] = useState<string>("");
  const [loadingDataUser, setLoadingDataUser] = useState<boolean>(true);
  const [loadingUploadImage, setLoadingUploadImage] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      fetchImageUser();
    }, []),
  );

  async function fetchImageUser() {
    try {
      const response = await api.get<IUser>("/auth/me");

      if (response.data.image) {
        setImageUser(response.data.image);
      }

      setNameUser(response.data.name);
    } catch (error) {
      console.error(error);

      Toast.show({
        type: "error",
        text1: getApiError(error),
      });
    } finally {
      setLoadingDataUser(false);
    }
  }

  async function handleChangePickImageUser() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Toast.show({
        type: "error",
        text1: "Permissão para acessar galeria é necessária",
      });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      Toast.show({
        type: "error",
        text1: "Erro ao selecionar arquivo",
      });
      return;
    }

    const asset = result.assets[0];

    const formData = new FormData();

    formData.append("file", {
      uri: asset.uri,
      name: asset.fileName ?? `upload.${asset.uri.split(".").pop()}`,
      type: asset.mimeType ?? "application/octet-stream",
    } as any);

    try {
      setLoadingUploadImage(true);

      //upload claudinary
      const responseUpload = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!responseUpload.data.url) throw new Error("Erro ao atualizar");

      const fileUrl = responseUpload.data.url;

      //atualiza state
      setImageUser(fileUrl);

      //atualizar a image do user no db
      const responseUpdateImage = await api.patch(
        `/user/update-image/${user?.id}`,
        {
          urlImage: fileUrl,
        },
      );

      console.log(responseUpdateImage.data);
    } catch (error) {
      console.error(error);

      Toast.show({
        type: "error",
        text1: getApiError(error),
      });
    } finally {
      setLoadingUploadImage(false);
    }
  }

  if (loadingDataUser) {
    return <LoadingSpinner />;
  }

  return (
    <View
      className="flex-1 gap-12"
      style={{
        backgroundColor: theme.colors.background,
        paddingTop: insets.top,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
      }}
    >
      <View>
        <Logo sizeImg={60} sizeText={32} />
      </View>

      <View className="items-center gap-4">
        <View>
          {loadingUploadImage ? (
            <ActivityIndicator size="large" color={theme.colors.purple} />
          ) : (
            <Avatar.Image
              source={imageUser ? { uri: imageUser } : avatarImage}
              size={120}
            />
          )}
        </View>
        <Pressable
          className="flex-row gap-2 items-center justify-center"
          onPress={handleChangePickImageUser}
        >
          <Feather name="camera" size={26} color={theme.colors.text} />
          <Text className="text-text text-xl">Alterar</Text>
        </Pressable>
      </View>

      <Pressable
        className="flex-row gap-2 items-center"
        onPress={() =>
          router.push({
            pathname: "/change-name/change-name",
            params: { name: nameUser, id: user?.id },
          })
        }
      >
        <View>
          <Feather name="user" size={36} color={theme.colors.text} />
        </View>
        <View>
          <Text className="text-text text-xl">Nome</Text>
          <Text className="text-gray text-lg">{nameUser}</Text>
        </View>
      </Pressable>

      <Pressable
        className="flex-1 flex-row gap-2 items-center  justify-center"
        onPress={logout}
      >
        <MaterialIcons name="logout" size={26} color={theme.colors.text} />
        <Text className="text-text text-xl font-bold">Sair</Text>
      </Pressable>
    </View>
  );
}
