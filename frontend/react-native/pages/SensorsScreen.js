import React, { useEffect, useState, useMemo } from "react";
import headerStyle from "../components/GlobalStyles/headerStyle";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  getGreenhouses,
  getSensorsByGreenhouse,
  getActuatorsByGreenhouse,
} from "../services/apiClient";
import { useNavigation } from "@react-navigation/native";
import { colors, typography, spacing, radius, elevation } from "../components/GlobalStyles/theme";
import { displayActuatorName } from "../services/actuatorLabels";

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

  const displayName = item.component_type === "Actuator"
    ? displayActuatorName(item.name)
    : (item.name || "");

  return (
    <View key={item.id} style={[styles.box, isDefect && styles.boxDefect]}>
      <View style={styles.boxHeader}>
        <Text style={styles.boxEyebrow}>{item.component_type}</Text>
        <View style={[styles.statusBadge, isDefect ? styles.statusBadgeBad : styles.statusBadgeGood]}>
          <Text style={[styles.statusBadgeText, isDefect ? styles.statusBadgeTextBad : styles.statusBadgeTextGood]}>
            {translatedStare}
          </Text>
        </View>
      </View>
      <Text style={styles.boxTitle}>{displayName}</Text>
      <Text style={styles.boxText}>Serie: {serie}</Text>

      {isDefect && (
        <TouchableOpacity onPress={() => handleStareClick(item, selectedSeraObject)} style={styles.alert}>
          <MaterialCommunityIcons name="alert-circle-outline" size={16} color={colors.error} />
          <Text style={styles.alertText}>
            {item.component_type} defect — află mai multe
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
        <Text style={styles.title}>Selectează o seră</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {sere.map((sera) => {
            const sel = sera.id === selectedSera;
            return (
              <Pressable
                key={sera.id}
                style={[styles.seraChip, sel && styles.seraChipSel]}
                onPress={() => setSelectedSera(sera.id)}
              >
                <MaterialCommunityIcons
                  name="greenhouse"
                  size={16}
                  color={sel ? colors.textOnAccent : colors.primary}
                />
                <Text style={[styles.seraChipText, sel && styles.seraChipTextSel]}>
                  {sera.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primaryMuted}
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

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.background,
    flexGrow: 1,
    paddingBottom: 150,
  },
  title: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  chipRow: {
    gap: spacing.xs,
    paddingBottom: spacing.md,
    paddingRight: spacing.md,
  },
  seraChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    minHeight: 40,
  },
  seraChipSel: { backgroundColor: colors.accent, borderColor: colors.accent },
  seraChipText: { ...typography.bodyStrong, color: colors.textPrimary },
  seraChipTextSel: { color: colors.textOnAccent },

  sectionTitle: {
    ...typography.eyebrow,
    color: colors.accentText,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  box: {
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: radius.card,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...elevation.card,
  },
  boxDefect: { borderColor: colors.error },
  boxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xxs,
  },
  boxEyebrow: { ...typography.eyebrow, color: colors.textSecondary },
  statusBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  statusBadgeGood: { backgroundColor: "rgba(74,122,82,0.14)" },
  statusBadgeBad: { backgroundColor: "rgba(192,73,47,0.14)" },
  statusBadgeText: { ...typography.unit },
  statusBadgeTextGood: { color: colors.success },
  statusBadgeTextBad: { color: colors.error },
  boxTitle: {
    ...typography.heading,
    fontSize: 17,
    color: colors.primary,
    marginBottom: spacing.xxs,
  },
  boxText: { ...typography.body, color: colors.textSecondary },
  alert: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
    backgroundColor: "rgba(192,73,47,0.12)",
    padding: spacing.xs,
    marginTop: spacing.xs,
    borderRadius: radius.sm,
  },
  alertText: {
    ...typography.caption,
    color: colors.error,
    fontFamily: typography.bodyStrong.fontFamily,
  },
});


export default SensorsScreen;