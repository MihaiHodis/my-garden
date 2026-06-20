import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import SoilIcon from "../assets/soilicon.png";
import {
  getSensorsByGreenhouse,
  getReadingsBySensor,
  getCommandsByActuator,
  sendActuatorCommand,
  getActuatorsByGreenhouse,
  getEffectiveUser,
} from "../services/apiClient";
import FavoriteHours from "./favoriteHours";
import { colors, typography, spacing, radius, elevation } from "./GlobalStyles/theme";
import { displayActuatorName, actuatorIcon } from "../services/actuatorLabels";

const screenWidth = Dimensions.get("window").width;

// --- ICON-uri pentru senzori ---
const SensorIcon = ({ type }) => {
  switch (type) {
    case "temperature":
      return <MaterialCommunityIcons name="thermometer" size={18} color={colors.primary} />;
    case "humidity":
      return <MaterialCommunityIcons name="water-percent" size={18} color={colors.primary} />;
    case "soil":
    case "soil_moisture":
      return <Image source={SoilIcon} style={{ width: 18, height: 18 }} />;
    default:
      return null;
  }
};

// array cu ID-uri Picsum (alege cât vrei)
const picsumIds = [1080, 696, 627, 955, 400];

// funcție care returnează imaginea pentru o seră
const getGreenhouseImage = (greenhouseId) => {
  const index = greenhouseId % picsumIds.length; // rotează dacă ai mai multe sere decât imagini
  const id = picsumIds[index];
  return `https://picsum.photos/id/${id}/600/400`;
};

// --- Fallback unitÄƒÈ›i pentru senzori ---
const getDefaultUnit = (type) => {
  switch (type) {
    case "temperature":
      return "Â°C";
    case "humidity":
    case "soil":
      return "%";
    default:
      return "";
  }
};


// --- ActuatorSwitch cu polling ---
const ActuatorSwitch = ({ label, actuatorId, iconName = "power" }) => {
  const [isOn, setIsOn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const intervalRef = useRef(null);
  const pollingRef = useRef(null);

  const currentUser = getEffectiveUser();
  const userId = currentUser?.uid;

  const fetchActuatorState = async () => {
    try {
      const { data: commands } = await getCommandsByActuator(actuatorId);
      const sorted = commands.sort((a, b) => new Date(b.issued_at) - new Date(a.issued_at));
      let isActive = false;
      let remainingTime = null;

      for (let cmd of sorted) {
        if (cmd.command === "off") {
          isActive = false;
          remainingTime = null;
          break;
        }
        if (cmd.command === "on") {
          if (!cmd.expires_at || new Date(cmd.expires_at) > new Date()) {
            isActive = true;
            if (cmd.expires_at) remainingTime = new Date(cmd.expires_at) - new Date();
          }
          break;
        }
      }

      setIsOn(isActive);
      setTimeLeft(remainingTime);
    } catch (err) {
      console.error("Eroare la fetch actuator state:", err);
    }
  };

  // -----------------------------
  // Polling la 2 secunde
  // -----------------------------
  useEffect(() => {
    fetchActuatorState(); // initial fetch
    pollingRef.current = setInterval(fetchActuatorState, 10000); // polling la 10 sec
    return () => clearInterval(pollingRef.current);
  }, [actuatorId]);

  // -----------------------------
  // TIMER LOGIC
  // -----------------------------
  useEffect(() => {
    if (isOn && timeLeft !== null) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (!prev || prev <= 1000) {
            clearInterval(intervalRef.current);
            setIsOn(false);
            setTimeLeft(null);

            sendActuatorCommand({
              actuator_id: actuatorId,
              command: "off",
              issued_by_user_id: userId,
            });
            return null;
          }
          return prev - 1000;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isOn, timeLeft]);

  // -----------------------------
  // TOGGLE ON/OFF
  // -----------------------------
  const handleToggle = () => {
    if (!isOn) {
      setModalVisible(true);
    } else {
      clearInterval(intervalRef.current);
      setIsOn(false);
      setTimeLeft(null);
      sendActuatorCommand({
        actuator_id: actuatorId,
        command: "off",
        issued_by_user_id: userId,
      });
    }
  };

  // -----------------------------
  // START TIMER
  // -----------------------------
  const handleStart = async () => {
    if (!userId) return console.error("User NU este autentificat!");
    setTimeLeft(selectedMinutes * 60000);
    setIsOn(true);
    setModalVisible(false);

    await sendActuatorCommand({
      actuator_id: actuatorId,
      command: "on",
      issued_by_user_id: userId,
      duration_minutes: selectedMinutes,
    });
  };

  const formatTime = ms => {
    if (!ms) return null;
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (num) => String(num).padStart(2, "0");
    if (hours > 0) return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    else return `${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <View style={styles.actuatorTile}>
      <Pressable
        style={[styles.actuatorBtn, isOn && styles.actuatorBtnOn]}
        onPress={handleToggle}
      >
        <MaterialCommunityIcons
          name={iconName}
          size={24}
          color={isOn ? colors.textOnAccent : colors.primary}
        />
        <View style={styles.actuatorBtnTextWrap}>
          <Text style={[styles.actuatorBtnLabel, isOn && styles.actuatorBtnLabelOn]} numberOfLines={1}>
            {label}
          </Text>
          {isOn ? (
            <Text style={styles.actuatorBtnState}>
              {timeLeft !== null ? `Oprire în ${formatTime(timeLeft)}` : "Pornit"}
            </Text>
          ) : (
            <Text style={styles.actuatorBtnStateOff}>Apasă pentru pornire</Text>
          )}
        </View>
        <MaterialCommunityIcons
          name={isOn ? "stop-circle" : "play-circle"}
          size={28}
          color={isOn ? colors.textOnAccent : colors.primary}
        />
      </Pressable>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Setează timer pentru {label}</Text>
            <Slider
              style={{ width: 220, height: 40 }}
              minimumValue={5}
              maximumValue={480}
              step={1}
              value={selectedMinutes}
              onValueChange={setSelectedMinutes}
              minimumTrackTintColor={colors.accent}
              maximumTrackTintColor={colors.track}
              thumbTintColor={colors.primary}
            />
            <Text style={styles.modalValue}>
              {selectedMinutes < 60
                ? `${selectedMinutes} minute`
                : `${Math.floor(selectedMinutes / 60)}h ${selectedMinutes % 60}m`}
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: spacing.sm }}>
              <Pressable style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={handleStart}>
                <Text style={styles.modalBtnPrimaryText}>Pornește</Text>
              </Pressable>
              <Pressable style={[styles.modalBtn, styles.modalBtnGhost]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalBtnGhostText}>Anulează</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// --- CARD PRINCIPAL ---
const GreenhouseCard = ({ greenhouse, sensors: sensorsProp, onPress }) => {
  const [sensors, setSensors] = useState([]);
  const [actuators, setActuators] = useState([]);

  // FuncÈ›ie pentru formatarea orei ultimei citiri
  const formatReadingTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleString('ro-RO', options);
  };

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        // Folosim prop-ul sensorsProp dacÄƒ existÄƒ, altfel le cerem de la server
        const sensorList = sensorsProp && sensorsProp.length > 0 
          ? sensorsProp 
          : (await getSensorsByGreenhouse(greenhouse.id)).data;

        const sensorsWithLast = await Promise.all(
          sensorList.map(async s => {
            const { data: readings } = await getReadingsBySensor(s.id);
            const last = readings[readings.length - 1];
            return { 
              ...s, 
              value: last?.value ?? "-", 
              unit: s.unit ?? getDefaultUnit(s.type),
              timestamp: last?.timestamp 
            };    
          })
        );
        setSensors(sensorsWithLast);
      } catch (error) {
        console.error("Failed to fetch sensors:", error);
      }
    };

    const fetchActuators = async () => {
      try {
        const { data: actuatorList } = await getActuatorsByGreenhouse(greenhouse.id);
        setActuators(actuatorList);
      } catch (error) {
        console.error("Failed to fetch actuators:", error);
      }
    };

    fetchSensors();
    fetchActuators();
  }, [greenhouse.id, sensorsProp]);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image
        source={{ uri: getGreenhouseImage(greenhouse.id) }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={styles.title}>{greenhouse?.name}</Text>
          <Text style={styles.location}>{greenhouse?.location}</Text>
        </View>

        <View style={{ alignItems: "center", marginTop: 14 }}>
          <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>      
            {sensors.map(s => (
              <View key={s.id} style={styles.sensorBadge}>
                <SensorIcon type={s.type} />
                <Text style={styles.sensorText}>{s.value}{s.unit}</Text>
                {s.timestamp ? (
                  <Text style={styles.sensorTime}>{formatReadingTime(s.timestamp)}</Text>
                ) : null}
              </View>
            ))}
          </View>
          <View style={{ marginTop: 4 }}>
            <FavoriteHours greenhouseId={greenhouse.id} />
          </View>
        </View>

        <View style={styles.actuatorRow}>
          {actuators.length > 0 ? (
            actuators.map(actuator => (
              <ActuatorSwitch
                key={actuator.id}
                label={displayActuatorName(actuator.name)}
                iconName={actuatorIcon(actuator.name)}
                actuatorId={actuator.id}
              />
            ))
          ) : (
            <Text style={styles.noActuatorText}>Nu sunt actuatoare definite</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// --- STILURI ---
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    overflow: "hidden",
    width: screenWidth > 420 ? 385 : "95%",
    marginBottom: spacing.md,
    marginHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    ...elevation.card,
  },
  image: {
    width: screenWidth > 420 ? 120 : 90,
    alignSelf: "stretch",
  },
  info: {
    flex: 1,
    padding: spacing.sm,
    justifyContent: "flex-start",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { ...typography.heading, fontSize: screenWidth > 420 ? 20 : 17, color: colors.primary },
  location: { ...typography.caption, color: colors.textSecondary },
  sensorBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: radius.chip,
    marginRight: spacing.xxs,
    marginBottom: spacing.xxs,
    minWidth: 50,
    justifyContent: "center",
  },
  sensorText: { ...typography.metricSmall, marginLeft: spacing.xxs, color: colors.textPrimary },
  sensorTime: { ...typography.unit, color: colors.textTertiary, marginLeft: spacing.xxs },
  actuatorRow: { flexDirection: "column", gap: spacing.xs, marginTop: spacing.sm },
  noActuatorText: { ...typography.caption, color: colors.textSecondary, textAlign: "center", flex: 1 },

  // Buton manual mare
  actuatorTile: { width: "100%" },
  actuatorBtn: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.surfaceMuted,
  },
  actuatorBtnOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  actuatorBtnTextWrap: { flex: 1, marginHorizontal: spacing.sm },
  actuatorBtnLabel: { ...typography.subtitle, color: colors.textPrimary },
  actuatorBtnLabelOn: { color: colors.textOnAccent },
  actuatorBtnState: { ...typography.metricSmall, color: colors.textOnAccent },
  actuatorBtnStateOff: { ...typography.caption, color: colors.textSecondary },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(30,70,50,0.45)",
  },
  modalCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.card,
    width: 280,
    alignItems: "center",
    ...elevation.raised,
  },
  modalTitle: { ...typography.subtitle, color: colors.textPrimary, marginBottom: spacing.sm, textAlign: "center" },
  modalValue: { ...typography.metricSmall, color: colors.primary, marginVertical: spacing.sm },
  modalBtn: {
    flex: 1,
    marginHorizontal: spacing.xxs,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: "center",
  },
  modalBtnPrimary: { backgroundColor: colors.primary },
  modalBtnPrimaryText: { ...typography.bodyStrong, color: colors.textOnDark },
  modalBtnGhost: { backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border },
  modalBtnGhostText: { ...typography.bodyStrong, color: colors.textPrimary },
});

export default GreenhouseCard;
