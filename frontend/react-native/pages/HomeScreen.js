import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import GreenhouseCard from "../components/GreenhouseCard";
import { getGreenhouses, getSensors, getUserById, getEffectiveUser } from "../services/apiClient";
import WeatherWidget from "../components/WeatherWidget";
import { useFonts, Roboto_700Bold } from "@expo-google-fonts/roboto";

const screenWidth = Dimensions.get("window").width;

const avatarImages = {
  "avatar_1.png": require("../assets/avatars/avatar_1.png"),
  "avatar_2.png": require("../assets/avatars/avatar_2.png"),
  "avatar_3.png": require("../assets/avatars/avatar_3.png"),
  "avatar_4.png": require("../assets/avatars/avatar_4.png"),
  "avatar_5.png": require("../assets/avatars/avatar_5.png"),
  "avatar_6.png": require("../assets/avatars/avatar_6.png"),
};

const HomeScreen = () => {
  const navigation = useNavigation();

  const [greenhouses, setGreenhouses] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [textWidth, setTextWidth] = useState(0);

  const loadData = async () => {
    try {
      // 🔹 Obține utilizatorul logat (Mock în dev, Firebase în prod)
      const currentUser = getEffectiveUser();
      
      if (!currentUser || !currentUser.uid) {
        console.warn("⚠️ Utilizatorul nu este încă disponibil.");
        return;
      }

      const [ghRes, sRes, userRes] = await Promise.all([
        getGreenhouses(),
        getSensors(),
        // 🔹 Trimite UID-ul real către backend
        getUserById(currentUser.uid),
      ]);

      setGreenhouses(ghRes.data);
      setSensors(sRes.data);
      setUser(userRes.data);
    } catch (e) {
      console.error("Eroare la fetch:", e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Se încarcă datele...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Sticky */}
      <View style={styles.headerSticky}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => navigation.navigate("Account")}
        >
          <Text style={styles.userName}>{user.nickname}</Text>
          <Image
            source={
              avatarImages[user.avatar] ||
              require("../assets/avatars/avatar_1.png")
            }
            style={styles.avatar}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.greenhousesContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <WeatherWidget location="Cluj-Napoca" />

        {/* Header Serele mele */}
        <View style={styles.headerContainer}>
          <Text
            style={styles.headerText}
            onLayout={(event) => setTextWidth(event.nativeEvent.layout.width)}
          >
            Sere agricole
          </Text>
          <View style={[styles.headerLine, { width: textWidth }]} />
        </View>

        {greenhouses.map((gh) => {
          const greenhouseSensors = sensors.filter(
            (s) => String(s.greenhouse_id) === String(gh.id)
          );

          return (
            <GreenhouseCard
              key={gh.id}
              greenhouse={gh}
              sensors={greenhouseSensors}
              onPress={() => console.log("Apăsat:", gh.name)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },

  headerSticky: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  logo: { height: 40, width: 150 },
  userInfo: { flexDirection: "row", alignItems: "center" },
  userName: {
    fontSize: 14,
    fontFamily: "Roboto_700Bold",
    color: "#AFD6B1",
    marginRight: 8,
    marginBottom: 3,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginBottom: 3 },

  greenhousesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    gap: 16,
    paddingTop: 80, // spațiu pentru header sticky
    paddingBottom: 20, // 👈 CHANGE FROM 100 to 140
  },

  headerContainer: { marginTop: 16, marginBottom: 12, marginHorizontal: 16 },
  headerText: {
    fontSize: 22,
    fontFamily: "Roboto_700Bold",
    color: "#000",
    textTransform: "uppercase",
  },
  headerLine: {
    height: 3,
    backgroundColor: "#AFD6B1",
    marginTop: 4,
    borderRadius: 2,
  },
});

export default HomeScreen;
