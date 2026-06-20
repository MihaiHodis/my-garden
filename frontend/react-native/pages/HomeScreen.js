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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import GreenhouseCard from "../components/GreenhouseCard";
import { getGreenhouses, getSensors, getUserById, getEffectiveUser } from "../services/apiClient";
import WeatherWidget from "../components/WeatherWidget";
import { colors, typography, spacing, radius } from "../components/GlobalStyles/theme";

const screenWidth = Dimensions.get("window").width;

const avatarImages = {
  "avatar_1.png": require("../assets/avatars/avatar_1.png"),
  "avatar_2.png": require("../assets/avatars/avatar_2.png"),
  "avatar_3.png": require("../assets/avatars/avatar_3.png"),
  "avatar_4.png": require("../assets/avatars/avatar_4.png"),
  "avatar_5.png": require("../assets/avatars/avatar_5.png"),
  "avatar_6.png": require("../assets/avatars/avatar_6.png"),
  "Den.jpg": require("../assets/avatars/Den.jpg"),
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

      console.log("DEBUG: Loaded user data in HomeScreen:", userRes.data);

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

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primaryMuted} />
        <Text style={styles.loadingText}>Se încarcă datele...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Sticky */}
      <View style={styles.headerSticky}>
        <Image
          source={require("../assets/mygarden-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => navigation.navigate("Account", { userId: user.firebase_uid })}
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
          <Text style={styles.headerEyebrow}>MONITORIZARE</Text>
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
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  loadingText: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },

  headerSticky: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    justifyContent: "space-between",
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: { height: 58, width: 200 },
  userInfo: { flexDirection: "row", alignItems: "center" },
  userName: {
    ...typography.bodyStrong,
    color: colors.primary,
    marginRight: spacing.xs,
    marginBottom: 3,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 3,
    borderWidth: 1.5,
    borderColor: colors.accent,
  },

  greenhousesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    paddingTop: 80, // spațiu pentru header sticky
    paddingBottom: spacing.lg,
  },

  headerContainer: { marginTop: spacing.md, marginBottom: spacing.sm, marginHorizontal: spacing.md },
  headerEyebrow: {
    ...typography.eyebrow,
    color: colors.accentText,
    marginBottom: 2,
  },
  headerText: {
    ...typography.title,
    color: colors.textPrimary,
  },
  headerLine: {
    height: 3,
    backgroundColor: colors.accent,
    marginTop: spacing.xxs,
    borderRadius: radius.pill,
  },
});

export default HomeScreen;
