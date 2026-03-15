// pages/SettingsPages/About.js
import React, { useState } from "react";
import { BUILD_INFO } from "../../services/build.js";
import { Footer } from "../../components/Footer/Footer.js"; // Import Footer component
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Import styles from components/settings_components directory
import {
  settingsStyles,
  aboutStyles,
} from "../../components/GlobalStyles/settingsStyles";

// Import icons from assets/settings-icons directory (go up 2 directories)
import {
  InfoIcon,
  GuideIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
} from "../../assets/settings-icons/icons";

const About = () => {
  const [expandedItems, setExpandedItems] = useState({});
  const navigation = useNavigation();

  const toggleExpanded = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleBackToSettings = () => {
    navigation.goBack(); // Go back to Settings page
  };

  const guideItems = [
    {
      id: "navigation",
      title: "Navigarea în aplicație",
      content:
        "Folosește meniul principal pentru a accesa diferitele secțiuni ale aplicației. Fiecare secțiune este organizată logic pentru a-ți oferi acces rapid la funcțiile de care ai nevoie. Poți naviga folosind meniul de sus sau butoanele din pagina principală.",
    },
    {
      id: "settings",
      title: "Setările contului",
      content:
        "Personalizează-ți experiența prin pagina de setări. Toate modificările sunt salvate automat.",
    },
    {
      id: "modules",
      title: "Module conectate",
      content:
        "Gestionează conexiunile cu serviciile externe prin secțiunea de module. Poți conecta diverse platforme și servicii pentru a integra datele tale. Fiecare modul poate fi configurat individual și activat/dezactivat după nevoie.",
    },
    {
      id: "sync",
      title: "Sincronizare automată",
      content:
        "Datele tale sunt sincronizate automat și în siguranță cu serverele noastre. Sincronizarea se face în timp real pentru a avea mereu informațiile actualizate. Poți verifica statusul sincronizării în setări.",
    },
  ];

  // Component for expandable guide item
  const GuideItem = ({ item }) => {
    const isExpanded = expandedItems[item.id];

    return (
      <View style={aboutStyles.dropdownItem}>
        <TouchableOpacity
          style={aboutStyles.dropdownHeader}
          onPress={() => toggleExpanded(item.id)}
          activeOpacity={0.7}
        >
          <View style={aboutStyles.dropdownHeaderLeft}>
            <CheckIcon size={20} style={{ color: "#4caf50" }} />
            <Text style={aboutStyles.dropdownHeaderText}>{item.title}</Text>
          </View>
          <ChevronDownIcon
            size={20}
            isOpen={isExpanded}
            style={{ color: "#666" }}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={aboutStyles.dropdownContent}>
            <Text style={aboutStyles.dropdownContentText}>{item.content}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={settingsStyles.container}>
      <View style={settingsStyles.maxWidthContainer}>
        {/* Header with back button */}
        <View style={aboutStyles.aboutPaper}>
          <TouchableOpacity
            style={settingsStyles.headerBox}
            onPress={handleBackToSettings}
            activeOpacity={0.8}
          >
            {/* Back icon on the left */}
            <View style={aboutStyles.aboutBackIcon}>
              <ChevronLeftIcon size={24} style={{ color: "black" }} />
            </View>

            {/* Centered content */}
            <View style={settingsStyles.headerContent}>
              <Text style={settingsStyles.headerTitle}>ByteStorm App</Text>
              <Text style={settingsStyles.headerSubtitle}>
                Aplicația ta de management și automatizare
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <View style={settingsStyles.maxWidthContainerScroll}>
          {/* About Section */}
          <View style={aboutStyles.aboutPaper}>
            <View style={settingsStyles.contentBox}>
              <View style={aboutStyles.sectionHeader}>
                <InfoIcon size={24} style={{ color: "rgba(175, 214, 177, 1)" }} />
                <Text style={aboutStyles.sectionHeaderText}>
                  Despre Aplicație
                </Text>
              </View>

              <Text style={aboutStyles.descriptionText}>
                ByteStorm App este o aplicație modernă construită pentru a
                simplifica și automatiza procesele tale de lucru. Aplicația
                oferă o interfață intuitivă și funcții avansate pentru a-ți
                îmbunătății productivitatea.
              </Text>

              <Text style={aboutStyles.descriptionSecondaryText}>
                Dezvoltată cu tehnologii moderne, aplicația asigură performanță
                ridicată, securitate maximă și o experiență de utilizare
                excepțională.
              </Text>
            </View>
          </View>

          {/* Guide Section */}
          <View style={aboutStyles.aboutPaper}>
            <View style={settingsStyles.contentBox}>
              <View style={aboutStyles.sectionHeader}>
                <GuideIcon size={24} style={{ color: "rgba(175, 214, 177, 1)" }} />
                <Text style={aboutStyles.sectionHeaderText}>
                  Cum se folosește
                </Text>
              </View>

              <View>
                {guideItems.map((item) => (
                  <GuideItem key={item.id} item={item} />
                ))}
              </View>
            </View>
          </View>

          {/* Version Information */}
          <View style={aboutStyles.aboutPaper}>
            <View style={settingsStyles.contentBox}>
              <View style={aboutStyles.versionContainer}>
                <Text style={aboutStyles.versionLabel}>Versiune</Text>
                <Text style={aboutStyles.versionNumber}>{BUILD_INFO}</Text>
              </View>
            </View>
          </View>

          <Footer />
        </View>
      </ScrollView>
    </View>
  );
};

export default About;
