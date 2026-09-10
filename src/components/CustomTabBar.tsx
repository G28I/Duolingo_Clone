import React, { useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface TabConfig {
  name: string;
  label: string;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
}

const TAB_CONFIGS: Record<string, TabConfig> = {
  index: {
    name: "index",
    label: "Home",
    activeIcon: "home",
    inactiveIcon: "home-outline",
  },
  learn: {
    name: "learn",
    label: "Learn",
    activeIcon: "book",
    inactiveIcon: "book-outline",
  },
  "ai-teacher": {
    name: "ai-teacher",
    label: "AI Teacher",
    activeIcon: "sparkles",
    inactiveIcon: "sparkles-outline",
  },
  chat: {
    name: "chat",
    label: "Chat",
    activeIcon: "chatbubble",
    inactiveIcon: "chatbubble-outline",
  },
  profile: {
    name: "profile",
    label: "Profile",
    activeIcon: "person",
    inactiveIcon: "person-outline",
  },
};

const CIRCLE_SIZE = 48;

export interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
  insets?: any;
}

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: CustomTabBarProps) {
  const activeIndex = state.index;
  const totalTabs = state.routes.length;
  const [containerWidth, setContainerWidth] = React.useState(
    Dimensions.get("window").width
  );

  const tabWidth = containerWidth / totalTabs;
  const translateX = useSharedValue(0);

  useEffect(() => {
    const targetX = activeIndex * tabWidth + (tabWidth - CIRCLE_SIZE) / 2;
    translateX.value = withSpring(targetX, {
      damping: 18,
      stiffness: 160,
      mass: 0.8,
    });
  }, [activeIndex, tabWidth, translateX]);

  const animatedCircleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <View
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          if (w > 0) setContainerWidth(w);
        }}
        className="relative flex-row items-center border-t border-[#F0F0F0] bg-white pt-1"
        style={styles.tabContainer}
      >
        {/* Animated Active Circle Background */}
        <Animated.View
          style={[styles.activeCircle, animatedCircleStyle]}
          className="absolute rounded-full bg-lingua-purple"
        />

        {/* Tab Items */}
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const config = TAB_CONFIGS[route.name] || {
            name: route.name,
            label: route.name,
            activeIcon: "ellipse",
            inactiveIcon: "ellipse-outline",
          };

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={config.label}
              activeOpacity={0.8}
              onPress={onPress}
              onLongPress={onLongPress}
              className="flex-1 items-center justify-center py-1"
              style={{ height: 56 }}
            >
              {isFocused ? (
                /* Active Tab: Icon only inside the animated circle */
                <Ionicons name={config.activeIcon} size={24} color="#FFFFFF" />
              ) : (
                /* Inactive Tab: Icon + Label */
                <View className="items-center justify-center gap-0.5">
                  <Ionicons
                    name={config.inactiveIcon}
                    size={22}
                    color="#6B7280"
                  />
                  <Text
                    numberOfLines={1}
                    className="font-['Poppins-Medium'] text-[11px] text-[#6B7280]"
                  >
                    {config.label}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#FFFFFF",
  },
  tabContainer: {
    height: 64,
  },
  activeCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    top: 8,
    backgroundColor: "#6C4EF5",
  },
});
