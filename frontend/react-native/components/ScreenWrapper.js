import React from "react";
import { View, StyleSheet } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets, // 👈 Make sure this is imported
} from "react-native-safe-area-context";
import BottomNavBar from "./BottomNavBar";
import { useFonts, Gugi_400Regular } from "@expo-google-fonts/gugi";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "./GlobalStyles/theme";

const ScreenWrapper = ({ children }) => {
  const [fontsLoaded] = useFonts({ Gugi_400Regular });
  const insets = useSafeAreaInsets(); // 👈 We need this to get the status bar height

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* 👇 ADD THIS VIEW BACK IN FOR THE WHITE STATUS BAR BACKGROUND */}
      <View
        style={[
          styles.topBarBackground,
          { height: insets.top, backgroundColor: colors.surface },
        ]}
      />

      {/* Screen content */}
      <View style={styles.content}>{children}</View>

      {/* Navigation Bar Section */}
      <View style={[styles.navBarWrapper, { paddingBottom: insets.bottom }]}>
        <LinearGradient
          // Soft light gradient for a subtle "raised" navbar
          colors={[colors.surface, colors.surfaceMuted]}
          locations={[0, 1]}
          style={styles.gradient}
          >
          <BottomNavBar />
          </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // misted-glass tint for the corners
  },
  // 👇 ADD THIS STYLE OBJECT FOR THE TOP BAR
  topBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Ensures it's above the grey background but below the sticky header
  },
  content: {
    flex: 1,
  },
  navBarWrapper: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderTopWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.canopy,
    shadowOffset: {
      width: 0,
      height: -6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  gradient: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
});

export default ScreenWrapper;