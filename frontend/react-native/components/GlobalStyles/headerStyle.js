import { StyleSheet, Dimensions } from "react-native";

export const headerStyle = StyleSheet.create({
  // Main Settings UI Styles (for settings list layout)

  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#AFD6B1",
    borderBottomMarginTop: 4,
    borderBottomHeight: 1,
    zIndex: 2,
    backgroundColor: "#ffffffff",
  },

  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#212121",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default headerStyle;
