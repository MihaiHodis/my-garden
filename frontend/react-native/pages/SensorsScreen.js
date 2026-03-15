import React, { useEffect, useState, useMemo } from "react";
import headerStyle from "../components/GlobalStyles/headerStyle";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  getGreenhouses,
  getSensorsByGreenhouse,
  getActuatorsByGreenhouse,
} from "../services/apiClient";
import { useNavigation } from "@react-navigation/native";

const SensorsScreen = () => {
  const [sere, setSere] = useState([]);
  const [selectedSera, setSelectedSera] = useState("");
  const [senzori, setSenzori] = useState([]);
  const [actuatori, setActuatori] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSere = async () => {
      try {
        const response = await getGreenhouses();
        const greenhouses = response.data;
        setSere(greenhouses);

        if (greenhouses.length > 0) {
          setSelectedSera(greenhouses[0].id);
        }
      } catch (error) {
        console.error("Eroare la încărcarea serelor:", error);
      }
    };
    fetchSere();
  }, []);

  // Find the full object for the selected greenhouse
  const selectedSeraObject = useMemo(() => {
    return sere.find(s => s.id === selectedSera);
  }, [sere, selectedSera]);

  useEffect(() => {
    if (!selectedSera) {
      setSenzori([]);
      setActuatori([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [sensorsRes, actuatorsRes] = await Promise.all([
          getSensorsByGreenhouse(selectedSera),
          getActuatorsByGreenhouse(selectedSera),
        ]);

        const sensorsWithStatus = sensorsRes.data.map((sensor) => ({
          ...sensor,
          component_type: 'Senzor', // Add component type for clarity
          Stare: sensor.technical_status || "necunoscut",
          serie: sensor.serial_number || "nespecificat",
        }));

        const actuatorsWithStatus = actuatorsRes.data.map((actuator) => ({
          ...actuator,
          component_type: 'Actuator', // Add component type for clarity
          Stare: actuator.technical_status || "necunoscut",
          serie: actuator.serial_number || "nespecificat",
        }));

        setSenzori(sensorsWithStatus);
        setActuatori(actuatorsWithStatus);
      } catch (error) {
        console.error("Eroare la încărcarea datelor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSera]);

  // --- MODIFIED ---
  const getCategoryForType = (type) => {
    const typeMap = {
      light: "light",
      pump: "pump",
      fan: "ventilation", // The type 'fan' from the DB maps to the 'ventilation' category
      humidity: "humidity",
      soil: "soil_humidity",
      soil_moisture: "soil_humidity",
      temperature: "temperature",
    };
    return typeMap[type.toLowerCase()] || null; // Return the category ID or null
  };
  // Now accepts the faulty item and the greenhouse object to pass them along
  const handleStareClick = (item, greenhouse) => {
    const categoryId = getCategoryForType(item.type); // Get the correct category ID

    if (categoryId) {
      // Navigate to the Module screen and pass the specific category ID to open
      navigation.navigate("Module", {
        faultyComponent: item,
        greenhouse: greenhouse,
        initialCategoryId: categoryId, // Pass the category ID to pre-select it
      });
    } else {
      // Fallback for unknown types: navigate to the generic module page
      console.warn(`Unknown component type "${item.type}", navigating to generic module page.`);
      navigation.navigate("Module", {
        faultyComponent: item,
        greenhouse: greenhouse,
      });
    }
  };

  const translateStatus = (status) => {
    if (!status) return 'Necunoscut';
    const lowerCaseStatus = status.toLowerCase();
    if (lowerCaseStatus === 'functional' || lowerCaseStatus === 'ok') {
      return 'Funcțional';
    }
    if (lowerCaseStatus === 'unfunctional' || lowerCaseStatus === 'error') {
      return 'Nefuncțional';
    }
    // Return the original status if it's not one of the above
    return status;
  };

const renderBox = (item) => {
  // The original status from the database
  const Stare = item.Stare || "necunoscut";
  
  // The new translated status for display
  const translatedStare = translateStatus(Stare);
  
  const serie = item.serie || "nespecificat";
  
  // The logic now uses the original English status (handles both ok/error and functional/unfunctional)
  const isDefect = Stare.toLowerCase() === "unfunctional" || Stare.toLowerCase() === "error";

  return (
    <View key={item.id} style={styles.box}>
      <Text style={styles.boxTitle}>
        {item.component_type}: {item.name || ""}
      </Text>
      <Text style={styles.boxText}>Serie: {serie}</Text>
      {/* Use the translated status for display */}
      <Text style={styles.boxText}>Stare: {translatedStare}</Text>

      {isDefect && (
        <TouchableOpacity onPress={() => handleStareClick(item, selectedSeraObject)} style={styles.alert}>
          <Text style={styles.alertText}>
            ⚠ {item.component_type} defect! Află mai multe
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

  return (
    <View style={{flex: 1}}>
      <View style={headerStyle.titleContainer}>
        <Text style={headerStyle.title}>Tehnică</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Selectează o seră:</Text>

        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={selectedSera}
            onValueChange={(value) => setSelectedSera(value)}
            style={[styles.dropdown, Platform.OS === "ios" && styles.iosPicker]}
            itemStyle={Platform.OS === "ios" && styles.iosPickerItem}
          >
            <Picker.Item label="Selectează..." value="" />
            {sere.map((sera) => (
              <Picker.Item key={sera.id} label={sera.name} value={sera.id} />
            ))}
          </Picker>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#555"
            style={{ marginTop: 20 }}
          />
        ) : selectedSera ? (
          <View>
            <Text style={styles.sectionTitle}>Senzori:</Text>
            {senzori.length > 0 ? (
              senzori.map((sensor) => renderBox(sensor))
            ) : (
              <Text style={styles.boxText}>
                Nu există senzori pentru această seră.
              </Text>
            )}

            <Text style={styles.sectionTitle}>Actuatori:</Text>
            {actuatori.length > 0 ? (
              actuatori.map((actuator) => renderBox(actuator))
            ) : (
              <Text style={styles.boxText}>
                Nu există actuatori pentru această seră.
              </Text>
            )}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

// ... styles remain the same
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
    paddingBottom: 150,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "#fff",
    marginBottom: 15,
    ...Platform.select({
      ios: {
        height: 50,
        justifyContent: "center",
      },
    }),
  },
  dropdown: {
    height: 50,
    width: "100%",
  },
  iosPicker: {
    height: 50,
    marginHorizontal: 0,
  },
  iosPickerItem: {
    height: 50,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "normal",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  box: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  boxTitle: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 4,
  },
  boxText: {
    fontSize: 14,
  },
  alert: {
    backgroundColor: "#ffcccc",
    padding: 8,
    marginTop: 8,
    borderRadius: 6,
  },
  alertText: {
    color: "#990000",
    fontWeight: "bold",
    fontSize: 13,
  },
});


export default SensorsScreen;