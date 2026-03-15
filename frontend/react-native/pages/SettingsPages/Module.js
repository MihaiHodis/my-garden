import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
// --- MODIFIED ---
// Import SafeAreaView from the correct library
import { SafeAreaView } from "react-native-safe-area-context";

import { settingsStyles, moduleStyles } from "../../components/GlobalStyles/settingsStyles";
import { ChevronLeftIcon, ChevronRightIcon } from "../../assets/settings-icons/icons";
import { LightIcon, PumpIcon, VentilationIcon, TemperatureIcon, HumidityIcon, SoilHumidityIcon } from "../../assets/settings-icons/moduleIcons";
import ModuleDebugTutorial from "./ModuleDebugTutorial";

const Module = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(null);

  // --- MODIFIED ---
  // Get route params, including the new 'initialCategoryId'
  const route = useRoute();
  const { faultyComponent, greenhouse, initialCategoryId } = route.params || {};

  // --- ADDED ---
  // This hook runs when the component loads or when initialCategoryId changes.
  // It automatically selects the correct category if an ID is passed.
  useEffect(() => {
    if (initialCategoryId) {
      const targetCategory = categories.find(c => c.id === initialCategoryId);
      if (targetCategory) {
        setSelectedCategory(targetCategory);
      }
    }
  }, [initialCategoryId]);

  const handleBackToSettings = () => {
    navigation.goBack();
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const categories = [
    { id: "light", name: "Lumină", description: "Senzori de lumină și LED-uri", icon: LightIcon, color: "#ffa726" },
    { id: "pump", name: "Pompă", description: "Sisteme de pompare și irigație", icon: PumpIcon, color: "#42a5f5" },
    { id: "ventilation", name: "Ventilație", description: "Ventilatoare și sisteme de aer", icon: VentilationIcon, color: "#66bb6a" },
    { id: "temperature", name: "Temperatură", description: "Senzori de temperatură", icon: TemperatureIcon, color: "#ef5350" },
    { id: "humidity", name: "Umiditate Aer", description: "Senzori de umiditate atmosferică", icon: HumidityIcon, color: "#26c6da" },
    { id: "soil_humidity", name: "Umiditate Sol", description: "Senzori de umiditate din sol", icon: SoilHumidityIcon, color: "#8d6e63" },
  ];

  const CategoryItem = ({ category }) => (
    <TouchableOpacity
      style={moduleStyles.categoryItem}
      onPress={() => setSelectedCategory(category)}
      activeOpacity={0.7}
    >
      <View style={[moduleStyles.categoryIconContainer, { backgroundColor: category.color + "20" }]}>
        <category.icon size={32} style={{ color: category.color }} />
      </View>
      <View style={moduleStyles.categoryTextContainer}>
        <Text style={moduleStyles.categoryTitle}>{category.name}</Text>
        <Text style={moduleStyles.categoryDescription}>{category.description}</Text>
      </View>
      <View style={moduleStyles.categoryArrow}>
        <ChevronRightIcon size={20} style={{ color: "#cccccc" }} />
      </View>
    </TouchableOpacity>
  );

  const CategoryDivider = () => <View style={moduleStyles.categoryDivider} />;

  if (selectedCategory) {
    return (
      // Pass the faultyComponent and greenhouse data to the tutorial
      <ModuleDebugTutorial
        category={selectedCategory}
        onBack={handleBackToCategories}
        faultyComponent={faultyComponent}
        greenhouse={greenhouse}
      />
    );
  }

  return (
    <SafeAreaView style={settingsStyles.container}>
      <View style={settingsStyles.maxWidthContainer}>
        <View style={settingsStyles.paper}>
          <TouchableOpacity
            style={settingsStyles.headerBox}
            onPress={handleBackToSettings}
            activeOpacity={0.8}
          >
            <View style={settingsStyles.backIcon}>
              <ChevronLeftIcon size={24} style={{ color: "black" }} />
            </View>
            <View style={settingsStyles.headerContent}>
              <Text style={settingsStyles.headerTitle}>Module conectate</Text>
              <Text style={settingsStyles.headerSubtitle}>
                Depanează senzori și actuatori
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <View style={settingsStyles.maxWidthContainerScroll}>
          <View style={settingsStyles.paper}>
            <View style={settingsStyles.contentBox}>
              <Text style={moduleStyles.infoTitle}>Cum funcționează?</Text>
              <Text style={moduleStyles.infoText}>
                Selectează categoria corespunzătoare componentei cu care ai
                probleme. Vei fi ghidat printr-un tutorial pas cu pas pentru a
                identifica și rezolva problemele comune.
              </Text>
            </View>
          </View>
          <View style={settingsStyles.paper}>
            <View style={settingsStyles.contentBox}>
              <Text style={moduleStyles.sectionTitle}>
                Selectează categoria pentru depanare:
              </Text>
              <View style={moduleStyles.categoriesContainer}>
                {categories.map((category, index) => (
                  <React.Fragment key={category.id}>
                    <CategoryItem category={category} />
                    {index < categories.length - 1 && <CategoryDivider />}
                  </React.Fragment>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Module;