import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets, // 👈 Make sure this is imported
} from "react-native-safe-area-context";
import BottomNavBar from "./BottomNavBar";
import { useFonts, Gugi_400Regular } from "@expo-google-fonts/gugi";
import { LinearGradient } from "expo-linear-gradient";

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
          { height: insets.top, backgroundColor: "#fff" },
        ]}
      />

      {/* Screen content */}
      <View style={styles.content}>{children}</View>

      {/* Navigation Bar Section */}
      <View style={[styles.navBarWrapper, { paddingBottom: insets.bottom }]}>
        <LinearGradient
          // Gradient for the "rounded 3D" highlight effect
          colors={[
          "rgba(211, 233, 212, 1)", // Bright highlight at the very top
          "rgba(175, 214, 177, 1)", // Your main color
          /*"rgba(143, 175, 145, 1)", // A slightly darker shade for volume*/
          ]}
          locations={[/*0, */0, 0.3]} // Controls the position of each color
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
    backgroundColor: "#f5f5f5", // This stays grey for the corners
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
    backgroundColor: "rgba(175, 214, 177, 1)",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 15,
  },
  gradient: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});

export default ScreenWrapper;