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
import { colors, typography, spacing, radius, elevation } from "./GlobalStyles/theme";

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
        <ActivityIndicator size="small" color={colors.primaryMuted} />
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
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    ...elevation.card,
  },
  loadingContainer: {
    width: width - 32,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
  },
  loadingText: {
    ...typography.caption,
    marginLeft: spacing.xs,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  left: {
    flexDirection: "column",
  },
  location: {
    ...typography.subtitle,
    color: colors.primary,
    marginBottom: 2,
  },
  tempRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  emoji: {
    fontSize: 22,
    marginRight: spacing.xxs,
  },
  temperature: {
    ...typography.metric,
    fontSize: 24,
    lineHeight: 28,
    color: colors.textPrimary,
  },
  right: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  detailText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginVertical: 1,
  },

  hourlyScroll: {
    marginTop: spacing.xs,
    paddingBottom: spacing.xxs,
    maxHeight: 96,
  },
  hourlyItem: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.chip,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    marginHorizontal: spacing.xxs,
    alignItems: "center",
    width: 56,
  },
  hourText: {
    ...typography.eyebrow,
    fontSize: 10,
    letterSpacing: 0.4,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  hourIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  hourTemp: {
    ...typography.metricSmall,
    fontSize: 12,
    color: colors.textPrimary,
  },
});

export default WeatherWidget;
