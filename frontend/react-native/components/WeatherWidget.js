import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getRealtimeWeather } from "../services/apiClient";

const { width } = Dimensions.get("window");

const WeatherWidget = ({ location = "Cluj-Napoca" }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const fetched = await getRealtimeWeather(location);
        setData(fetched);
      } catch (e) {
        console.error(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [location]);

  const getWeatherEmoji = (type) => {
    const t = type?.toLowerCase() || "";
    if (t.includes("clear")) return "☀️";
    if (t.includes("cloud")) return "☁️";
    if (t.includes("rain")) return "🌧️";
    if (t.includes("snow")) return "❄️";
    if (t.includes("storm") || t.includes("thunder")) return "⛈️";
    return "🌤️";
  };

  if (loading || !data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#000" />
        <Text style={styles.loadingText}>Se încarcă vremea...</Text>
      </View>
    );
  }

  const { currentWeather, hourlyForecast } = data;

  return (
    <SafeAreaView style={styles.container}>
      {/* Date curente */}
      <View style={styles.header}>
        <View style={styles.left}>
          <Text style={styles.location}>{currentWeather.location}</Text>
          <View style={styles.tempRow}>
            <Text style={styles.emoji}>
              {getWeatherEmoji(currentWeather.weather_type)}
            </Text>
            <Text style={styles.temperature}>
              {Math.round(currentWeather.temperature)}°C
            </Text>
          </View>
        </View>

        <View style={styles.right}>
          <Text style={styles.detailText}>
            💧Umiditate: {currentWeather.humidity}%
          </Text>
          <Text style={styles.detailText}>💨Vânt: {currentWeather.wind}</Text>
        </View>
      </View>

      {/* Prognoza pe ore */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.hourlyScroll}
        contentContainerStyle={{ paddingHorizontal: 6 }}
      >
        {hourlyForecast?.map((item, index) => (
          <View key={index} style={styles.hourlyItem}>
            <Text style={styles.hourText}>{item.hour}</Text>
            <Text style={styles.hourIcon}>
              {getWeatherEmoji(item.weather_type)}
            </Text>
            <Text style={styles.hourTemp}>{Math.round(item.temp)}°C</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    backgroundColor: "#AFD6B1",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  loadingContainer: {
    width: width - 32,
    backgroundColor: "#AFD6B1",
    padding: 8,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  loadingText: {
    marginLeft: 8,
    color: "#000",
    fontSize: 13,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  left: {
    flexDirection: "column",
  },
  location: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 2,
  },
  tempRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  emoji: {
    fontSize: 22,
    marginRight: 4,
  },
  temperature: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  right: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  detailText: {
    fontSize: 12,
    color: "#000",
    marginVertical: 1,
  },

  hourlyScroll: {
    marginTop: 6,
    paddingBottom: 4,
    maxHeight: 90,
  },
  hourlyItem: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    alignItems: "center",
    width: 56,
  },
  hourText: {
    fontSize: 11,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 2,
  },
  hourIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  hourTemp: {
    fontSize: 13,
    color: "#000",
    fontWeight: "bold",
  },
});

export default WeatherWidget;
