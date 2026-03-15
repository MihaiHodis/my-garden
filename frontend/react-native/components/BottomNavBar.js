// BottomNavBar.jsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const navItems = [
  { label: "Acasă", route: "Home", icon: "home" },
  { label: "Tehnică", route: "Sensors", icon: "rss" },
  { label: "Statistici", route: "Statistics", icon: "chart-bar" },
  { label: "Setări", route: "Settings", icon: "cog" },
];

const BottomNavBar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.navBar}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.route}
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => navigation.navigate(item.route)}
        >
          <MaterialCommunityIcons name={item.icon} size={26} color="#000" />
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    height: 50,
    zIndex: 1000,
    paddingTop: 10,
    // The shadow properties have been removed from here
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: "#000",
  },
});

export default BottomNavBar;
