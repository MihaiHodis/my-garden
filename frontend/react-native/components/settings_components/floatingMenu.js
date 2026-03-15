import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

export default function FloatingMenu() {
  const [open, setOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    setOpen(!open);
    Animated.spring(animation, {
      toValue: open ? 0 : 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    if (open) toggleMenu();
  };

  const menuItems = [
    { label: "How It Works" },
    { label: "AI Support" },
    { label: "AI Agronomist" },
  ];

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Dim background */}
      {open && (
        <TouchableWithoutFeedback onPress={closeMenu}>
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.6],
                }),
              },
            ]}
          />
        </TouchableWithoutFeedback>
      )}

      {/* Menu container */}
      <View style={styles.container}>
        {menuItems.map((item, index) => {
          const translateY = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -(index + 1) * 65],
          });

          const scale = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
          });

          const opacity = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          });

          return (
            <Animated.View
              key={item.label}
              style={[
                styles.menuItem,
                {
                  transform: [{ translateY }, { scale }],
                  opacity,
                },
              ]}
            >
              <TouchableOpacity style={styles.menuButton}>
                <Text style={styles.menuText}>{item.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab} onPress={toggleMenu}>
          <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>
            {open ? "×" : "+"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  container: {
    position: "absolute",
    bottom: 50,
    left: 20,
    alignItems: "flex-start",
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  menuItem: {
    position: "absolute",
    left: 0,
  },
  menuButton: {
    backgroundColor: "#000",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
  },
  menuText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
