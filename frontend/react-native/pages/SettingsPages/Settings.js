// pages/SettingsPages/Settings.js
import React, { useState, useEffect } from "react";
import { useNavigation, Alert } from "@react-navigation/native";
import { Footer } from "../../components/Footer/Footer";
import headerStyle from "../../components/GlobalStyles/headerStyle";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { settingsUIStyles } from "../../components/GlobalStyles/settingsStyles";
import {
  PersonIcon,
  InfoIcon,
  AppsIcon,
  LogoutIcon,
  ChevronRightIcon,
  BugReportIcon,
} from "../../assets/settings-icons/icons";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { getEffectiveUser } from "../../services/apiClient";

// 1. Import the new CustomAlert component
import CustomAlert from "../../components/settings_components/CustomAlert";

const Settings = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigation = useNavigation();

  // 2. Add state to manage the visibility of the custom alert
  const [isLogoutAlertVisible, setLogoutAlertVisible] = useState(false);

  useEffect(() => {
    // 🔹 Obține utilizatorul logat (Mock în dev, Firebase în prod)
    const currentUser = getEffectiveUser();
    if (currentUser) {
      setCurrentUserId(currentUser.uid);
      console.log("User ID set on component mount:", currentUser.uid);
    } else {
      console.warn("Settings screen loaded, but no user is authenticated.");
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logout functionality executed");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Eroare", "Delogarea a eșuat.");
    }
    setLogoutAlertVisible(false); // Close the alert after logging out
  };

  const handleButtonClick = (id) => {
    if (id === "logout") {
      // 3. Instead of calling Alert.alert, just show our custom modal
      setLogoutAlertVisible(true);
    } else if (id === "about") {
      navigation.navigate("About");
    } else if (id === "account") {
      if (currentUserId) {
        navigation.navigate("Account", { userId: currentUserId });
      } else {
        // Fallback or alert
        console.warn("User ID not found");
      }
    } else if (id === "module") {
      navigation.navigate("Module");
    } else if (id === "contact") {
      navigation.navigate("Contact");
    }
  };

  const SettingsItem = ({ id, icon: IconComponent, title, subtitle, isLogout = false }) => {
    return (
      <TouchableOpacity
        style={[settingsUIStyles.settingsItem]}
        onPress={() => handleButtonClick(id)}
        activeOpacity={0.7}
      >
        <View style={settingsUIStyles.iconContainer}><IconComponent /></View>
        <View style={settingsUIStyles.textContainer}>
          <Text style={[settingsUIStyles.primaryText, isLogout && settingsUIStyles.logoutText]}>{title}</Text>
          <Text style={settingsUIStyles.secondaryText}>{subtitle}</Text>
        </View>
        <View style={{ marginLeft: 8 }}><ChevronRightIcon style={{ color: isLogout ? "#ffcdd2" : "#cccccc" }} size={20} /></View>
      </TouchableOpacity>
    );
  };
  const Divider = () => <View style={settingsUIStyles.divider} />;

  return (
    <View style={settingsUIStyles.container}>
      <View style={headerStyle.titleContainer}>
        <Text style={headerStyle.title}>Setări</Text>
      </View>

      <ScrollView style={settingsUIStyles.scrollView}>
        <View style={settingsUIStyles.contentContainer}>
          <View style={settingsUIStyles.settingsCard}>
            <SettingsItem id="account" icon={PersonIcon} title="Setări Cont" subtitle="Gestionează contul și informațiile personale" />
            <Divider />
            <SettingsItem id="about" icon={InfoIcon} title="Despre Aplicație" subtitle="Versiune, termeni și condiții" />
            <Divider />
            <SettingsItem id="module" icon={AppsIcon} title="Module conectate" subtitle="Gestionează modulele și conexiunile" />
            <Divider />
            <SettingsItem id="contact" icon={BugReportIcon} title="Pagină de contact" subtitle="Trimite feedback sau raportează erori" />
            <Divider />
            <SettingsItem id="logout" icon={LogoutIcon} title="Deloghează-te" subtitle="Ieși din cont" isLogout={true} />
          </View>
          <Footer />
        </View>
      </ScrollView>

      <CustomAlert
        visible={isLogoutAlertVisible}
        onClose={() => setLogoutAlertVisible(false)}
        title="Deloghează-te"
        message="Ești sigur că vrei să te deloghezi?"
        buttons={[
          {
            text: "Anulează",
            onPress: () => setLogoutAlertVisible(false),
            style: 'default',
          },
          {
            text: "Deloghează-te",
            onPress: handleLogout,
            style: 'destructive',
          },
        ]}
      />
    </View>
  );
};

export default Settings;
