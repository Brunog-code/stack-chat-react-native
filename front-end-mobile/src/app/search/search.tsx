import { View, Text, Image, FlatList } from "react-native";
import emptyListImage from "../../../assets/images/empty-img-search.png";
import { TextInput } from "react-native-paper";
import { theme } from "@/src/constants/theme";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { api } from "@/src/lib/api";
import { IResponseSearchRooms } from "@/src/types";
import { ChatCard } from "@/src/components/ChatRoomCard";
import { getApiError } from "@/src/utils/get-api-error";
import Toast from "react-native-toast-message";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";

export default function SearchChat() {
  const [textSearchInput, setTextSearchInput] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [groupsResult, setGroupsResult] = useState<IResponseSearchRooms[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const router = useRouter();

  const insets = useSafeAreaInsets();

  //clearInput
  useEffect(() => {
    if (textSearchInput.length > 0) return;
    setIsLoadingSearch(true);
    setGroupsResult([]);
  }, [textSearchInput]);

  //debounc
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(textSearchInput);
    }, 500);

    return () => clearTimeout(handler);
  }, [textSearchInput]);

  //chama function quando tiver algo no debouceValue
  useEffect(() => {
    if (debouncedValue.trim().length === 0) return;

    handleSearchGroup(debouncedValue);
  }, [debouncedValue]);

  async function handleSearchGroup(text: string) {
    if (
      textSearchInput.trim().length == 0 ||
      debouncedValue.trim().length === 0
    )
      return;

    try {
      const response = await api.get<IResponseSearchRooms[]>("/search-group", {
        params: {
          textSearch: debouncedValue,
        },
      });

      setGroupsResult(response.data);
    } catch (error) {
      console.log(error);

      Toast.show({
        type: "error",
        text1: getApiError(error),
      });
    } finally {
      setIsLoadingSearch(false);
    }
  }

  function handleOpenRoom(id: string, name: string, image: string) {
    router.push({
      pathname: "/chat/[roomId]",
      params: { roomId: id, name: name, image: image },
    });
  }

  return (
    <View
      className="flex-1 items-center gap-10  w-full px-2"
      style={{ paddingTop: insets.top + 4, paddingBottom: insets.bottom + 4 }}
    >
      <View className="flex-row items-center justify-center ">
        <TextInput
          mode="outlined"
          value={textSearchInput}
          onChangeText={setTextSearchInput}
          outlineColor={theme.colors.gray}
          textColor={theme.colors.text}
          activeOutlineColor={theme.colors.purple}
          theme={{ roundness: 20 }}
          style={{
            backgroundColor: theme.colors.details_bg,
            borderRadius: 50,
            width: "90%",
          }}
          placeholder="Buscar Chats"
          placeholderTextColor={theme.colors.gray}
          left={
            <TextInput.Icon
              icon="magnify"
              color={theme.colors.purple}
              size={28}
            />
          }
          right={
            <TextInput.Icon
              icon="close"
              color={theme.colors.purple}
              size={28}
              onPress={() => router.back()}
            />
          }
        />
      </View>

      <View className="flex-1 justify-center items-center w-full">
        {textSearchInput.length === 0 ? (
          <Text className="text-text text-xl">Digite algo para buscar</Text>
        ) : groupsResult.length === 0 && !isLoadingSearch ? (
          <Image
            source={emptyListImage}
            style={{
              width: "70%",
              aspectRatio: 1,
              resizeMode: "contain",
            }}
          />
        ) : isLoadingSearch ? (
          <LoadingSpinner />
        ) : (
          <FlatList
            data={groupsResult}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 26 }} />}
            renderItem={({ item }) => (
              <ChatCard
                img={item.image}
                title={item.name}
                description={item.description}
                onPress={() => handleOpenRoom(item.id, item.name, item.image)}
              />
            )}
          />
        )}
      </View>
    </View>
  );
}
