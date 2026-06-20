// BottomNavBar.jsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, typography, fonts, spacing, radius } from "./GlobalStyles/theme";

const navItems = [
  { label: "Acasă", route: "Home", icon: "home" },
  { label: "Tehnică", route: "Sensors", icon: "rss" },
  { label: "Statistici", route: "Statistics", icon: "chart-bar" },
  { label: "Setări", route: "Settings", icon: "cog" },
];

const BottomNavBar = () => {
  const navigation = useNavigation();
  // Read-only: which route is currently focused, to highlight the active tab.
  const currentRoute = useNavigationState(
    (state) => state?.routes?.[state.index]?.name
  );

  return (
    <View style={styles.navBar}>
      {navItems.map((item) => {
        const active = currentRoute === item.route;
        return (
          <TouchableOpacity
            key={item.route}
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color={active ? colors.primary : colors.textSecondary}
              />
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    height: 56,
    zIndex: 1000,
    paddingTop: spacing.xs,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    borderRadius: radius.pill,
  },
  iconWrapActive: {
    backgroundColor: colors.accent, // chlorophyll-lime pill on the active tab
  },
  label: {
    ...typography.caption,
    fontSize: 11,
    lineHeight: 14,
    marginTop: spacing.xxs,
    color: colors.textSecondary,
  },
  labelActive: {
    fontFamily: fonts.bodySemiBold,
    color: colors.primary,
  },
});

export default BottomNavBar;
