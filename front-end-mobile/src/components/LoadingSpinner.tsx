import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { theme } from "../constants/theme";

export const LoadingSpinner = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <ActivityIndicator size="large" color={theme.colors.purple} />
    </View>
  );
};
