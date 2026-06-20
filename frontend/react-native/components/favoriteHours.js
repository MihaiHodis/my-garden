import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Modal,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
    getActuatorsByGreenhouse,
    getActuatorSchedulesByGreenhouse,
    createActuatorSchedule,
    deleteActuatorSchedule,
    getEffectiveUser,
} from "../services/apiClient";
import { colors, typography, spacing, radius, elevation } from "./GlobalStyles/theme";
import { displayActuatorName } from "../services/actuatorLabels";

const pad = (n) => String(n).padStart(2, "0");

// ───── Selector de oră prietenos: butoane mari −/+ în loc de dropdown ─────
const TimeStepper = ({ label, value, onChange }) => {
    const [h, m] = value.split(":").map(Number);
    const setHour = (nh) => onChange(`${pad((nh + 24) % 24)}:${pad(m)}`);
    const setMin = (nm) => onChange(`${pad(h)}:${pad((nm + 60) % 60)}`);

    const StepBtn = ({ icon, onPress }) => (
        <TouchableOpacity style={styles.stepBtn} onPress={onPress} activeOpacity={0.7}>
            <MaterialCommunityIcons name={icon} size={26} color={colors.primary} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.stepperBlock}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <View style={styles.stepperRow}>
                <View style={styles.stepperGroup}>
                    <StepBtn icon="chevron-up" onPress={() => setHour(h + 1)} />
                    <Text style={styles.stepperValue}>{pad(h)}</Text>
                    <Text style={styles.stepperUnit}>oră</Text>
                    <StepBtn icon="chevron-down" onPress={() => setHour(h - 1)} />
                </View>

                <Text style={styles.colon}>:</Text>

                <View style={styles.stepperGroup}>
                    <StepBtn icon="chevron-up" onPress={() => setMin(m + 5)} />
                    <Text style={styles.stepperValue}>{pad(m)}</Text>
                    <Text style={styles.stepperUnit}>min</Text>
                    <StepBtn icon="chevron-down" onPress={() => setMin(m - 5)} />
                </View>
            </View>
        </View>
    );
};

const FavoriteHours = ({ greenhouseId }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [actuators, setActuators] = useState([]);
    const [selectedActuator, setSelectedActuator] = useState(null);
    const [startTime, setStartTime] = useState("08:00");
    const [endTime, setEndTime] = useState("17:00");
    const [schedules, setSchedules] = useState([]);
    const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().slice(0, 10));

    useEffect(() => {
        if (!greenhouseId) return;

        const fetchData = async () => {
            try {
                const actuatorsRes = await getActuatorsByGreenhouse(greenhouseId);
                setActuators(actuatorsRes.data);

                const schedulesRes = await getActuatorSchedulesByGreenhouse(greenhouseId);
                setSchedules(schedulesRes.data);
            } catch (err) {
                console.error("Error loading actuators or schedules:", err);
                Alert.alert("Eroare", "Nu s-au putut încărca datele. Încearcă din nou.");
            }
        };

        fetchData();
    }, [greenhouseId]);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const day = d.getDate();
        const month = d.toLocaleString("default", { month: "short" });
        return `${day} ${month}.`;
    };

    const getCurrentUserId = () => getEffectiveUser()?.uid;

    const handleSetFavorite = async () => {
        if (!selectedActuator) {
            Alert.alert("Atenție", "Selectează un actuator.");
            return;
        }

        // Comparare corectă start/stop
        const [startH, startM] = startTime.split(":").map(Number);
        const [endH, endM] = endTime.split(":").map(Number);
        const startTotalMinutes = startH * 60 + startM;
        const endTotalMinutes = endH * 60 + endM;

        if (endTotalMinutes <= startTotalMinutes) {
            Alert.alert("Eroare", "Ora de oprire trebuie să fie după ora de pornire.");
            return;
        }

        const selectedDateTime = new Date(`${scheduleDate}T${startTime}:00`);
        const now = new Date();
        if (selectedDateTime < now) {
            Alert.alert("Eroare", "Nu poți seta o oră de start în trecut.");
            return;
        }

        // ───── Verificare suprapunere ─────
        const overlapping = schedules.some((s) =>
            s.actuator_id === selectedActuator &&
            s.schedule_date === scheduleDate && (
                (startTime >= s.start_time && startTime < s.end_time) || // start în interval existent
                (endTime > s.start_time && endTime <= s.end_time) ||      // end în interval existent
                (startTime <= s.start_time && endTime >= s.end_time)      // interval existent complet inclus
            )
        );

        if (overlapping) {
            Alert.alert("Eroare", "Această programare se suprapune cu alta existentă pentru actuatorul selectat.");
            return;
        }

        const payload = {
            actuator_id: selectedActuator,
            greenhouse_id: greenhouseId,
            schedule_date: scheduleDate,
            start_time: startTime,
            end_time: endTime,
            issued_by_user_id: getCurrentUserId(),
        };

        try {
            const newSchedule = await createActuatorSchedule(payload);
            setSchedules((prev) => [...prev, newSchedule]);
            Alert.alert("Succes", "Programare adăugată!");
        } catch (err) {
            console.error("Error creating schedule:", err);
            Alert.alert("Eroare", "Nu s-a putut adăuga programarea.");
        }
    };

    const handleDeleteFavorite = async (id) => {
        try {
            await deleteActuatorSchedule(id);
            setSchedules((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error("Error deleting schedule:", err);
            Alert.alert("Eroare", "Nu s-a putut șterge programarea.");
        }
    };

    return (
        <View>
            <TouchableOpacity
                style={styles.triggerBtn}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
            >
                <MaterialCommunityIcons name="water-sync" size={18} color={colors.primary} />
                <Text style={styles.triggerText}>Programează irigare</Text>
                <MaterialCommunityIcons name="chevron-right" size={18} color={colors.primary} />
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modal}>
                    <View style={styles.modalBox}>
                        <Text style={styles.eyebrow}>PROGRAMARE</Text>
                        <Text style={styles.title}>Programează irigare</Text>

                        <ScrollView contentContainerStyle={{ paddingBottom: spacing.md }} showsVerticalScrollIndicator={false}>
                            {/* Selectare actuator — butoane mari */}
                            <Text style={styles.fieldLabel}>Alege actuatorul</Text>
                            <View style={styles.actuatorChips}>
                                {actuators.length === 0 ? (
                                    <Text style={styles.emptyText}>Nu sunt actuatoare definite.</Text>
                                ) : (
                                    actuators.map((a) => {
                                        const sel = selectedActuator === a.id;
                                        return (
                                            <Pressable
                                                key={a.id}
                                                style={[styles.actuatorChip, sel && styles.actuatorChipSel]}
                                                onPress={() => setSelectedActuator(a.id)}
                                            >
                                                {sel && (
                                                    <MaterialCommunityIcons
                                                        name="check"
                                                        size={16}
                                                        color={colors.textOnAccent}
                                                        style={{ marginRight: spacing.xxs }}
                                                    />
                                                )}
                                                <Text style={[styles.actuatorChipText, sel && styles.actuatorChipTextSel]}>
                                                    {displayActuatorName(a.name)}
                                                </Text>
                                            </Pressable>
                                        );
                                    })
                                )}
                            </View>

                            {/* Selectare ore — steppere mari */}
                            <View style={styles.timeRow}>
                                <TimeStepper label="Pornire" value={startTime} onChange={setStartTime} />
                                <TimeStepper label="Oprire" value={endTime} onChange={setEndTime} />
                            </View>

                            <View style={styles.buttonRow}>
                                <Pressable style={[styles.button, styles.buttonPrimary]} onPress={handleSetFavorite}>
                                    <Text style={styles.buttonPrimaryText}>Setează</Text>
                                </Pressable>
                                <Pressable style={[styles.button, styles.buttonGhost]} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.buttonGhostText}>Ieșire</Text>
                                </Pressable>
                            </View>

                            {/* Lista programări */}
                            {schedules.length > 0 && (
                                <View style={styles.scheduleTable}>
                                    <Text style={styles.fieldLabel}>Programări active</Text>
                                    {schedules.map((f) => (
                                        <View key={f.id} style={styles.scheduleRow}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.scheduleName}>
                                                    {displayActuatorName(actuators.find((a) => a.id === f.actuator_id)?.name) || f.actuator_id}
                                                </Text>
                                                <Text style={styles.scheduleMeta}>{formatDate(f.schedule_date)}</Text>
                                            </View>
                                            <Text style={styles.scheduleTime}>
                                                {f.start_time.slice(0, 5)} → {f.end_time.slice(0, 5)}
                                            </Text>
                                            <TouchableOpacity
                                                style={styles.deleteBtn}
                                                onPress={() => handleDeleteFavorite(f.id)}
                                            >
                                                <MaterialCommunityIcons name="close" size={18} color={colors.error} />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    // Trigger button (în card)
    triggerBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.surfaceMuted,
        borderWidth: 1.5,
        borderColor: colors.primary,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: radius.pill,
        minHeight: 40,
    },
    triggerText: { ...typography.bodyStrong, marginHorizontal: spacing.xxs, color: colors.primary },

    // Modal
    modal: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(30,70,50,0.45)", padding: spacing.md },
    modalBox: {
        backgroundColor: colors.surface,
        padding: spacing.lg,
        borderRadius: radius.card,
        width: "100%",
        maxWidth: 380,
        maxHeight: "85%",
        ...elevation.raised,
    },
    eyebrow: { ...typography.eyebrow, color: colors.accentText, textAlign: "center" },
    title: { ...typography.heading, color: colors.primary, textAlign: "center", marginBottom: spacing.md },

    fieldLabel: { ...typography.bodyStrong, color: colors.textPrimary, marginBottom: spacing.xs, marginTop: spacing.xs },
    emptyText: { ...typography.caption, color: colors.textSecondary },

    // Chips actuator
    actuatorChips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginBottom: spacing.sm },
    actuatorChip: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: radius.pill,
        borderWidth: 1.5,
        borderColor: colors.border,
        backgroundColor: colors.surfaceMuted,
        minHeight: 44,
    },
    actuatorChipSel: { backgroundColor: colors.accent, borderColor: colors.accent },
    actuatorChipText: { ...typography.bodyStrong, color: colors.textPrimary },
    actuatorChipTextSel: { color: colors.textOnAccent },

    // Steppere ore
    timeRow: { flexDirection: "row", justifyContent: "space-between", gap: spacing.sm },
    stepperBlock: { flex: 1, alignItems: "center", marginVertical: spacing.xs },
    stepperRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surfaceMuted,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.xs,
    },
    stepperGroup: { alignItems: "center", justifyContent: "center" },
    stepBtn: {
        width: 44,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius.sm,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        marginVertical: spacing.xxs,
    },
    stepperValue: { ...typography.metric, fontSize: 26, color: colors.textPrimary, marginVertical: spacing.xxs },
    stepperUnit: { ...typography.unit, color: colors.textTertiary },
    colon: { ...typography.metric, fontSize: 26, color: colors.textTertiary, marginHorizontal: spacing.xs },

    // Butoane
    buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: spacing.md, gap: spacing.xs },
    button: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.sm, alignItems: "center", minHeight: 48, justifyContent: "center" },
    buttonPrimary: { backgroundColor: colors.primary },
    buttonPrimaryText: { ...typography.subtitle, color: colors.textOnDark },
    buttonGhost: { backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border },
    buttonGhostText: { ...typography.subtitle, color: colors.textPrimary },

    // Lista programări
    scheduleTable: { marginTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: spacing.xs },
    scheduleRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    scheduleName: { ...typography.bodyStrong, color: colors.textPrimary },
    scheduleMeta: { ...typography.caption, color: colors.textSecondary },
    scheduleTime: { ...typography.metricSmall, color: colors.primary, marginHorizontal: spacing.sm },
    deleteBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: radius.sm },
});

export default FavoriteHours;
