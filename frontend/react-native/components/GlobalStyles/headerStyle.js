import { StyleSheet } from "react-native";
import { colors, fonts } from "./theme";

export const headerStyle = StyleSheet.create({
  // Shared top title bar (Tehnică / Statistici / Setări)
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 2,
    backgroundColor: colors.surface,
  },

  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.primary,
    textAlign: "center",
    letterSpacing: -0.3,
  },
});

export default headerStyle;
