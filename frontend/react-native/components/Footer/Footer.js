import { View, Text } from "react-native";
import { settingsStyles } from "../GlobalStyles/settingsStyles";
// Footer
export const Footer = () => (
  <View style={settingsStyles.footer}>
    <Text style={settingsStyles.footerText}>
      © {new Date().getFullYear()} Bytestorm. Toate drepturile rezervate.
    </Text>
  </View>
);
