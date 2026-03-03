import { Pressable, View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { theme } from "../constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const CustomTabs = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const tabs = [
    {
      name: "home",
      label: "Chats",
      icon: <Ionicons name="chatbubble-outline" size={24} />,
    },
    {
      name: "perfil",
      label: "Perfil",
      icon: <Feather name="user" size={24} />,
    },
  ];

  return (
    <LinearGradient
      colors={["rgba(32,41,66,0)", "rgba(32,41,66,0.8)", "rgba(32,41,66,1)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        width: "100%",
        height: 80 + insets.bottom, // 👈 adiciona inset aqui
        position: "absolute",
        bottom: 0,
      }}
    >
      <View
        style={{
          position: "absolute",
          bottom: insets.bottom + 5, // 👈 sobe respeitando safe area
          left: 50,
          right: 50,
        }}
        className="flex-row justify-around py-1 bg-details_bg border-2 border-purple rounded-3xl"
      >
        {state.routes.map((route, index) => {
          const isActive = state.index === index;

          const tab = tabs.find((t) => t.name === route.name);

          return (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              className="items-center px-5 py-1 rounded-3xl"
              style={{
                backgroundColor: isActive ? theme.colors.purple : "transparent",
              }}
            >
              <View className="items-center gap-1 justify-center">
                {/* Clona o ícone com a cor correta */}
                {tab?.icon &&
                  React.cloneElement(tab.icon, {
                    color: isActive ? theme.colors.text : theme.colors.gray,
                  })}
                <Text
                  className={`text-base ml-1   ${isActive ? " font-bold text-text" : "font-normal text-gray"}`}
                >
                  {tab?.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </LinearGradient>
  );
};
