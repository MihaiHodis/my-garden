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
  Animated,
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

const screenWidth = Dimensions.get("window").width;

// --- ICON-uri pentru senzori ---
const SensorIcon = ({ type }) => {
  switch (type) {
    case "temperature":
      return <MaterialCommunityIcons name="thermometer" size={18} color="#333" />;
    case "humidity":
      return <MaterialCommunityIcons name="water-percent" size={18} color="#333" />;
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


// --- Custom Switch ---
const CustomSwitch = ({ value, onValueChange }) => {
  const offsetX = useRef(new Animated.Value(value ? 20 : 0)).current;

  useEffect(() => {
    Animated.timing(offsetX, {
      toValue: value ? 20 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  return (
    <Pressable onPress={() => onValueChange(!value)}>
      <View style={[styles.track, value && styles.trackOn]}>
        <Animated.View style={[styles.thumb, { left: offsetX }]} />
      </View>
    </Pressable>
  );
};

// --- ActuatorSwitch cu polling ---
const ActuatorSwitch = ({ label, actuatorId }) => {
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
    <View style={{ alignItems: "center", marginHorizontal: 2 }}>
      <CustomSwitch value={isOn} onValueChange={handleToggle} />
      <Text style={{ fontSize: 11, marginTop: 2, textAlign: "center" }}>{label}</Text>
      {timeLeft !== null && (
        <View style={{ alignItems: "center", marginTop: 2 }}>
          <Text style={{ fontSize: 10, color: "#555", textAlign: "center" }}>Oprire automată</Text>
          <Text style={{ fontSize: 10, color: "#555", textAlign: "center" }}>{formatTime(timeLeft)}</Text>
        </View>
      )}

      <Modal visible={modalVisible} transparent>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: "#AFD6B1", padding: 20, borderRadius: 10, width: 280, alignItems: "center" }}>
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Setează timer pentru {label}</Text>
            <Slider
              style={{ width: 220, height: 40 }}
              minimumValue={5}
              maximumValue={480}
              step={1}
              value={selectedMinutes}
              onValueChange={setSelectedMinutes}
              minimumTrackTintColor="#fff"
              maximumTrackTintColor="#aaa"
              thumbTintColor="#fff"
            />
            <Text style={{ marginVertical: 10 }}>
              {selectedMinutes < 60
                ? `${selectedMinutes} minute`
                : `${Math.floor(selectedMinutes / 60)}h ${selectedMinutes % 60}m`}
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 10 }}>
              <Pressable style={{ flex: 1, marginHorizontal: 5, paddingVertical: 8, backgroundColor: "#fff", borderRadius: 6, alignItems: "center" }} onPress={handleStart}>
                <Text style={{ fontWeight: "bold" }}>Pornește</Text>
              </Pressable>
              <Pressable style={{ flex: 1, marginHorizontal: 5, paddingVertical: 8, backgroundColor: "#fff", borderRadius: 6, alignItems: "center" }} onPress={() => setModalVisible(false)}>
                <Text style={{ fontWeight: "bold" }}>Anulează</Text>
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
                <Text style={styles.sensorText}>
                  {s.value}{s.unit} {s.timestamp ? `(${formatReadingTime(s.timestamp)})` : ""}
                </Text>
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
                label={actuator.name}
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
    backgroundColor: "#AFD6B1",
    borderRadius: 10,
    overflow: "hidden",
    width: screenWidth > 420 ? 385 : "95%",
    // marginVertical: 8, // 👈 REMOVE THIS LINE
    marginBottom: 16,     // 👈 ADD THIS LINE
    marginHorizontal: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  image: {
    width: screenWidth > 420 ? 120 : 90,
    alignSelf: "stretch",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  info: {
    flex: 1,
    padding: 8,
    justifyContent: "flex-start",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: screenWidth > 420 ? 18 : 16, fontWeight: "bold", color: "#333" },
  location: { fontSize: screenWidth > 420 ? 12 : 10, color: "#666" },
  sensorBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.3)", paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4, marginRight: 4, marginBottom: 4, minWidth: 50, justifyContent: "center" },
  sensorText: { marginLeft: 4, fontSize: 10, color: "#333" },
  actuatorRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 12 },
  track: { width: 40, height: 20, borderRadius: 10, backgroundColor: "#ccc", justifyContent: "center" },
  trackOn: { backgroundColor: "#34C759" },
  thumb: { width: 18, height: 18, borderRadius: 9, backgroundColor: "#fff", position: "absolute", top: 1 },
  noActuatorText: { fontSize: 12, color: "#555", textAlign: "center", flex: 1 },
});

export default GreenhouseCard;
