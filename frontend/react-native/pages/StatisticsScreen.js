import React, { useState, useEffect, useMemo, useCallback } from "react";
import headerStyle from "../components/GlobalStyles/headerStyle"; // Import header styles
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import {
  getGreenhouses,
  getSensorsByGreenhouse,
  getReadingsBySensor,
  getOutsideWeatherByGreenhouse,
} from "../services/apiClient.js";
import SensorChart from "../components/SensorChart.native.js";
import { colors, typography, spacing, radius, elevation } from "../components/GlobalStyles/theme";
import {
  subHours,
  subDays,
  format,
  parseISO,
  startOfToday,
  startOfDay,
  endOfDay,
  isWithinInterval,
} from "date-fns";
// import { ro } from 'date-fns/locale';

const screenWidth = Dimensions.get("window").width;

const StatisticsScreen = () => {
  const [greenhouses, setGreenhouses] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [sensorReadings, setSensorReadings] = useState([]);
  const [outsideWeather, setOutsideWeather] = useState([]);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState("");
  const [selectedSensorType, setSelectedSensorType] = useState("temperature");
  const [selectedSensorId, setSelectedSensorId] = useState("");
  const [timeRange, setTimeRange] = useState("24h");
  const [optimalValueMin, setOptimalValueMin] = useState("25");
  const [optimalValueMax, setOptimalValueMax] = useState("35");
  const [loading, setLoading] = useState(true);
  const [drillDownDate, setDrillDownDate] = useState(null);
  const [previousTimeRange, setPreviousTimeRange] = useState(null);

  useEffect(() => {
    getGreenhouses()
      .then((response) => {
        setGreenhouses(response.data);
        if (response.data.length > 0) {
          setSelectedGreenhouse(response.data[0].id);
        }
      })
      .catch((error) => console.error("Error fetching greenhouses:", error));
  }, []);

  useEffect(() => {
    if (selectedGreenhouse) {
      setLoading(true);
      let isMounted = true;

      // Fetch Sensors
      getSensorsByGreenhouse(selectedGreenhouse)
        .then((response) => {
          if (!isMounted) return;
          const fetchedSensors = response.data;
          setSensors(fetchedSensors);
          const currentTypeSensor =
            fetchedSensors.find((s) => s.type === selectedSensorType) ||
            fetchedSensors[0];
          if (currentTypeSensor) {
            setSelectedSensorId(currentTypeSensor.id);
          } else {
            setSelectedSensorId("");
            setSensorReadings([]); // Clear readings if no sensor is found
            setSensors([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching sensors:", error);
          if (isMounted) {
             setSensors([]);
             setSensorReadings([]);
             setSelectedSensorId("");
          }
        });

      // Fetch Outside Weather
      getOutsideWeatherByGreenhouse(selectedGreenhouse)
        .then((response) => {
          if (isMounted) setOutsideWeather(response.data);
        })
        .catch((error) => {
          console.error("Error fetching outside weather data:", error);
          if (isMounted) setOutsideWeather([]);
        });

      return () => { isMounted = false; };
    }
  }, [selectedGreenhouse, selectedSensorType]);

  // FIX: This useEffect now uses an AbortController to cancel old requests.
  useEffect(() => {
    const controller = new AbortController();

    if (selectedSensorId) {
      setLoading(true);
      getReadingsBySensor(selectedSensorId, controller.signal)
        .then((response) => {
          setSensorReadings(response.data);
        })
        .catch((error) => {
          if (error.name !== 'CanceledError') {
            console.error("Error fetching sensor readings:", error);
            setSensorReadings([]);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setSensorReadings([]);
      setLoading(false);
    }

    // Cleanup function: This is called when the dependency changes,
    // canceling the previous fetch request.
    return () => {
      controller.abort();
    };
  }, [selectedSensorId]);

  const uniqueSensorTypes = useMemo(() => {
    const types = sensors.map((s) => s.type);
    return [...new Set(types)];
  }, [sensors]);

  const sensorsForDropdown = useMemo(() => {
    return sensors.filter((s) => s.type === selectedSensorType);
  }, [sensors, selectedSensorType]);

  const handleSensorTypeChange = (newType) => {
    setSelectedSensorType(newType);
    const firstSensorOfType = sensors.find((s) => s.type === newType);
    setSelectedSensorId(firstSensorOfType ? firstSensorOfType.id : "");
  };

  const handleDrillDown = useCallback(
    (date) => {
      setPreviousTimeRange(timeRange);
      setDrillDownDate(date);
    },
    [timeRange]
  );

  const handleGoBack = () => {
    setTimeRange(previousTimeRange);
    setDrillDownDate(null);
    setPreviousTimeRange(null);
  };

  const chartDetails = useMemo(() => {
    // FIX: This guard clause prevents the function from running with inconsistent state.
    // It waits until the `sensors` list has updated to match the `selectedSensorId`.
    if (loading || !selectedSensorId || !sensors.find(s => s.id === selectedSensorId)) {
        return null;
    }

    const currentSensor = sensors.find((s) => s.id === selectedSensorId);
    // If somehow currentSensor is still null after the guard clause, exit early.
    if (!currentSensor) return null;

    const sensorUnit = currentSensor.unit || "";
    const now = new Date();
    const oMin = parseFloat(optimalValueMin);
    const oMax = parseFloat(optimalValueMax);

    const validWeatherTypes = ['temperature', 'humidity'];

    if (drillDownDate) {
      const dayStart = startOfDay(parseISO(drillDownDate));
      const dayEnd = endOfDay(parseISO(drillDownDate));

      const filterForDay = (readings) =>
        readings
          .map((d) => ({ ...d, timestamp: parseISO(d.timestamp) }))
          .filter((d) =>
            isWithinInterval(d.timestamp, { start: dayStart, end: dayEnd })
          )
          .sort((a, b) => a.timestamp - b.timestamp);

      const todaysSensorReadings = filterForDay(sensorReadings);
      const todaysOutsideWeather = filterForDay(outsideWeather);

      if (todaysSensorReadings.length === 0) return null;
      
      let outsideDataPoints = [];
      if (validWeatherTypes.includes(selectedSensorType) && todaysOutsideWeather.length > 0) {
        outsideDataPoints = todaysSensorReadings.map((sensorReading) => {
          const closestOutside = todaysOutsideWeather.reduce(
            (prev, curr) =>
              Math.abs(curr.timestamp - sensorReading.timestamp) <
              Math.abs(prev.timestamp - sensorReading.timestamp)
                ? curr
                : prev,
            todaysOutsideWeather[0]
          );
          return Math.abs(closestOutside.timestamp - sensorReading.timestamp) <
            30 * 60 * 1000
            ? closestOutside[selectedSensorType]
            : null;
        });
      }

      return {
        type: "line",
        title: `Citiri din data de ${format(dayStart, "d MMM yyyy")}`,
        labels: todaysSensorReadings.map((r) => format(r.timestamp, "HH:mm")),
        dataPoints: todaysSensorReadings.map((r) => r.value),
        outsideDataPoints,
        optimalValueMin: oMin,
        optimalValueMax: oMax,
        sensorUnit,
        rawValues: todaysSensorReadings.map((r) => r.value),
        showOutsideWeather: validWeatherTypes.includes(selectedSensorType),
      };
    }

    if (timeRange === "24h") {
      const twentyFourHoursAgo = subHours(now, 24);
      const filteredReadings = sensorReadings
        .map((d) => ({ ...d, timestamp: parseISO(d.timestamp) }))
        .filter((d) => d.timestamp >= twentyFourHoursAgo && d.timestamp <= now)
        .sort((a, b) => a.timestamp - b.timestamp);

      const filteredOutsideWeather = outsideWeather
        .map((d) => ({ ...d, timestamp: parseISO(d.timestamp) }))
        .filter((d) => d.timestamp >= twentyFourHoursAgo && d.timestamp <= now)
        .sort((a, b) => a.timestamp - b.timestamp);

      if (filteredReadings.length === 0) return null;

      let outsideDataPoints = [];
      if (validWeatherTypes.includes(selectedSensorType) && filteredOutsideWeather.length > 0) {
        outsideDataPoints = filteredReadings.map((sensorReading) => {
            const closestOutside = filteredOutsideWeather.reduce(
            (prev, curr) =>
                Math.abs(curr.timestamp - sensorReading.timestamp) <
                Math.abs(prev.timestamp - sensorReading.timestamp)
                ? curr
                : prev,
            filteredOutsideWeather[0] || { timestamp: new Date(0) }
            );
            return Math.abs(closestOutside.timestamp - sensorReading.timestamp) <
            30 * 60 * 1000
            ? closestOutside[selectedSensorType]
            : null;
        });
      }

      return {
        type: "line",
        title: "Citiri din ultimele 24 de ore",
        labels: filteredReadings.map((d) => format(d.timestamp, "HH:mm")),
        dataPoints: filteredReadings.map((d) => d.value),
        outsideDataPoints,
        optimalValueMin: oMin,
        optimalValueMax: oMax,
        sensorUnit,
        rawValues: filteredReadings.map((r) => r.value),
        showOutsideWeather: validWeatherTypes.includes(selectedSensorType),
      };
    } else {
      const days = timeRange === "7d" ? 7 : 30;
      const pastDate = subDays(startOfToday(), days - 1);

      const filteredReadings = sensorReadings
        .map((d) => ({ ...d, timestamp: parseISO(d.timestamp) }))
        .filter((d) => d.timestamp >= pastDate && d.timestamp <= now);

      if (filteredReadings.length === 0) return null;

      const dailyAggregates = {};
      filteredReadings.forEach((d) => {
        const day = format(d.timestamp, "yyyy-MM-dd");
        if (!dailyAggregates[day]) dailyAggregates[day] = [];
        dailyAggregates[day].push(d.value);
      });

      const dateLabels = Object.keys(dailyAggregates).sort();
      const displayLabels = dateLabels.map((day) =>
        format(parseISO(day), "MMM d")
      );
      const inRangePercentages = [];
      const outOfRangePercentages = [];

      dateLabels.forEach((dayKey) => {
        const dayValues = dailyAggregates[dayKey];
        const totalReadings = dayValues.length;
        const inRangeCount = dayValues.filter(
          (v) => v >= oMin && v <= oMax
        ).length;
        inRangePercentages.push((inRangeCount / totalReadings) * 100);
        outOfRangePercentages.push(
          ((totalReadings - inRangeCount) / totalReadings) * 100
        );
      });

      return {
        type: "bar",
        title: `Conformitate zilnică (Ultimele ${dateLabels.length} zile)`,
        dateLabels,
        displayLabels,
        datasets: {
          inRange: inRangePercentages,
          outOfRange: outOfRangePercentages,
        },
        sensorUnit,
        rawValues: filteredReadings.map((r) => r.value),
      };
    }
  }, [
    sensorReadings,
    outsideWeather,
    sensors,
    selectedSensorId,
    timeRange,
    optimalValueMin,
    optimalValueMax,
    loading,
    drillDownDate,
    selectedSensorType,
  ]);

  const summaryStats = useMemo(() => {
    if (
      !chartDetails ||
      !chartDetails.rawValues ||
      chartDetails.rawValues.length === 0
    ) {
      return { min: "N/A", max: "N/A", avg: "N/A", inRange: "N/A" };
    }
    const dataSet = chartDetails.rawValues.filter((v) => v !== null);
    if (dataSet.length === 0)
      return { min: "N/A", max: "N/A", avg: "N/A", inRange: "N/A" };

    const min = Math.min(...dataSet).toFixed(1);
    const max = Math.max(...dataSet).toFixed(1);
    const avg = (
      dataSet.reduce((a, b) => Number(a) + Number(b), 0) / dataSet.length
    ).toFixed(1);

    const oMin = parseFloat(optimalValueMin);
    const oMax = parseFloat(optimalValueMax);
    const inRangeCount = dataSet.filter(
      (val) => val >= oMin && val <= oMax
    ).length;
    const inRange = ((inRangeCount / dataSet.length) * 100).toFixed(0) + "%";

    return { min, max, avg, inRange };
  }, [chartDetails, optimalValueMin, optimalValueMax]);

  const isDrillDown = !!drillDownDate;

  const timeRangeDisplay =
    previousTimeRange === "7d"
      ? "7 zile"
      : previousTimeRange === "30d"
      ? "30 zile"
      : previousTimeRange;

  // Selector reutilizabil sub formă de chips orizontale
  const ChipRow = ({ items, selectedValue, onSelect, emptyText }) => {
    if (!items || items.length === 0) {
      return <Text style={styles.chipEmpty}>{emptyText}</Text>;
    }
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {items.map((it) => {
          const sel = it.value === selectedValue;
          return (
            <Pressable
              key={String(it.value)}
              style={[styles.chip, sel && styles.chipSel]}
              onPress={() => onSelect(it.value)}
            >
              <Text style={[styles.chipText, sel && styles.chipTextSel]}>{it.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <View style={styles.safeArea}>
      <View style={headerStyle.titleContainer}>
        <Text style={headerStyle.title}>Statistici</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 110, paddingTop: 30 }}
      >
        {!isDrillDown && (
          <View style={styles.filtersContainer}>
            <Text style={styles.label}>Seră</Text>
            <ChipRow
              items={greenhouses.map((g) => ({ label: g.name, value: g.id }))}
              selectedValue={selectedGreenhouse}
              onSelect={setSelectedGreenhouse}
              emptyText="Nicio seră disponibilă"
            />

            <Text style={styles.label}>Tip senzor</Text>
            <ChipRow
              items={uniqueSensorTypes.map((type) => ({
                label: type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
                value: type,
              }))}
              selectedValue={selectedSensorType}
              onSelect={handleSensorTypeChange}
              emptyText="Niciun tip de senzor"
            />

            <Text style={styles.label}>Senzor specific</Text>
            <ChipRow
              items={sensorsForDropdown.map((s) => ({ label: s.name, value: s.id }))}
              selectedValue={selectedSensorId}
              onSelect={setSelectedSensorId}
              emptyText="Niciun senzor de acest tip"
            />

            <View style={styles.optimalRangeContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Min optim</Text>
                <TextInput
                  style={styles.input}
                  value={optimalValueMin}
                  onChangeText={setOptimalValueMin}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Max optim</Text>
                <TextInput
                  style={styles.input}
                  value={optimalValueMax}
                  onChangeText={setOptimalValueMax}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        )}

        <View style={styles.timeButtonsContainer}>
          {isDrillDown ? (
            <TouchableOpacity style={styles.button} onPress={handleGoBack}>
              <Text style={styles.buttonText}>
                ← Înapoi la vizualizarea pe {timeRangeDisplay}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[
                  styles.button,
                  timeRange === "24h" && styles.activeButton,
                ]}
                onPress={() => setTimeRange("24h")}
              >
                <Text
                  style={[
                    styles.buttonText,
                    timeRange === "24h" && styles.activeButtonText,
                  ]}
                >
                  24 ore
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  timeRange === "7d" && styles.activeButton,
                ]}
                onPress={() => setTimeRange("7d")}
              >
                <Text
                  style={[
                    styles.buttonText,
                    timeRange === "7d" && styles.activeButtonText,
                  ]}
                >
                  7 zile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  timeRange === "30d" && styles.activeButton,
                ]}
                onPress={() => setTimeRange("30d")}
              >
                <Text
                  style={[
                    styles.buttonText,
                    timeRange === "30d" && styles.activeButtonText,
                  ]}
                >
                  30 zile
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.chartContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primaryMuted} />
          ) : chartDetails ? (
            <SensorChart
              chartDetails={chartDetails}
              onDrillDown={handleDrillDown}
            />
          ) : (
            <Text style={styles.noDataText}>
              Nicio dată disponibilă pentru senzorul sau perioada selectată.
            </Text>
          )}
        </View>

        <View style={styles.cardsContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Minim</Text>
            <Text style={styles.cardValue}>
              {summaryStats.min}
              {chartDetails?.sensorUnit}
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Maxim</Text>
            <Text style={styles.cardValue}>
              {summaryStats.max}
              {chartDetails?.sensorUnit}
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Medie</Text>
            <Text style={styles.cardValue}>
              {summaryStats.avg}
              {chartDetails?.sensorUnit}
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>În Parametrii</Text>
            <Text style={[styles.cardValue, { color: colors.success }]}>
              {summaryStats.inRange}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: spacing.sm },
  filtersContainer: { marginBottom: spacing.sm },
  label: { ...typography.bodyStrong, color: colors.textPrimary, marginBottom: spacing.xs, marginTop: spacing.sm },
  chipRow: { gap: spacing.xs, paddingRight: spacing.md },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    minHeight: 40,
    justifyContent: "center",
  },
  chipSel: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { ...typography.bodyStrong, color: colors.textPrimary },
  chipTextSel: { color: colors.textOnAccent },
  chipEmpty: { ...typography.caption, color: colors.textTertiary, paddingVertical: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.xs,
    ...typography.metricSmall,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    height: 50,
  },
  optimalRangeContainer: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs },
  timeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  button: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    minHeight: 40,
    justifyContent: "center",
  },
  activeButton: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  buttonText: { ...typography.bodyStrong, color: colors.primary },
  activeButtonText: { color: colors.textOnAccent },
  chartContainer: {
    alignItems: "center",
    marginBottom: spacing.lg,
    minHeight: 300,
    justifyContent: 'center'
  },
  noDataText: { ...typography.body, textAlign: "center", color: colors.textSecondary },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoCard: {
    width: "48%",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: "center",
    backgroundColor: colors.surface,
    ...elevation.card,
  },
  cardTitle: {
    ...typography.eyebrow,
    color: colors.textSecondary,
    marginBottom: spacing.xxs,
  },
  cardValue: { ...typography.metric, fontSize: 22, color: colors.textPrimary },
});

export default StatisticsScreen;