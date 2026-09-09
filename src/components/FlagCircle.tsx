import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface FlagCircleProps {
  languageId: string;
  flagEmoji?: string;
  size?: number;
}

export function FlagCircle({ languageId, flagEmoji, size = 44 }: FlagCircleProps) {
  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  switch (languageId) {
    case "es":
      // Spain: Red (25%), Yellow (50%), Red (25%) horizontal stripes
      return (
        <View style={[styles.container, containerStyle]}>
          <View style={[styles.flex1, { backgroundColor: "#AA151B" }]} />
          <View style={[styles.flex2, { backgroundColor: "#F1BF00", justifyContent: "center", paddingLeft: 6 }]}>
            {/* Subtle crest indicator */}
            <View style={{ width: 6, height: 8, backgroundColor: "#AA151B", borderRadius: 2 }} />
          </View>
          <View style={[styles.flex1, { backgroundColor: "#AA151B" }]} />
        </View>
      );

    case "fr":
      // France: Blue (33%), White (33%), Red (33%) vertical stripes
      return (
        <View style={[styles.container, containerStyle, { flexDirection: "row" }]}>
          <View style={[styles.flex1, { backgroundColor: "#002395" }]} />
          <View style={[styles.flex1, { backgroundColor: "#FFFFFF" }]} />
          <View style={[styles.flex1, { backgroundColor: "#ED2939" }]} />
        </View>
      );

    case "ja":
      // Japan: White with central red circle
      return (
        <View style={[styles.container, containerStyle, { backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" }]}>
          <View style={{ width: size * 0.54, height: size * 0.54, borderRadius: (size * 0.54) / 2, backgroundColor: "#BC002D" }} />
        </View>
      );

    case "ko":
      // South Korea: White background with red/blue Taegeuk and subtle trigram marks
      return (
        <View style={[styles.container, containerStyle, { backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" }]}>
          {/* Subtle trigram dots */}
          <View style={{ position: "absolute", top: 5, left: 6, width: 4, height: 2, backgroundColor: "#000", transform: [{ rotate: "-45deg" }] }} />
          <View style={{ position: "absolute", bottom: 5, right: 6, width: 4, height: 2, backgroundColor: "#000", transform: [{ rotate: "-45deg" }] }} />
          <View style={{ position: "absolute", top: 5, right: 6, width: 4, height: 2, backgroundColor: "#000", transform: [{ rotate: "45deg" }] }} />
          <View style={{ position: "absolute", bottom: 5, left: 6, width: 4, height: 2, backgroundColor: "#000", transform: [{ rotate: "45deg" }] }} />
          {/* Taegeuk circle */}
          <View style={{ width: size * 0.48, height: size * 0.48, borderRadius: (size * 0.48) / 2, overflow: "hidden" }}>
            <View style={{ flex: 1, backgroundColor: "#C60C30" }} />
            <View style={{ flex: 1, backgroundColor: "#003478" }} />
          </View>
        </View>
      );

    case "de":
      // Germany: Black (33%), Red (33%), Gold (33%) horizontal stripes
      return (
        <View style={[styles.container, containerStyle]}>
          <View style={[styles.flex1, { backgroundColor: "#000000" }]} />
          <View style={[styles.flex1, { backgroundColor: "#DD0000" }]} />
          <View style={[styles.flex1, { backgroundColor: "#FFCE00" }]} />
        </View>
      );

    case "zh":
      // China: Red with yellow star representation
      return (
        <View style={[styles.container, containerStyle, { backgroundColor: "#EE1C25", justifyContent: "center", paddingLeft: 8 }]}>
          <Text style={{ color: "#FFDE00", fontSize: 16, lineHeight: 18 }}>★</Text>
        </View>
      );

    default:
      return (
        <View style={[styles.container, containerStyle, { backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center" }]}>
          <Text style={{ fontSize: size * 0.55 }}>{flagEmoji || "🌐"}</Text>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
});
