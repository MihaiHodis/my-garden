import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Modal,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    Platform,
    ScrollView,
    Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
    getActuatorsByGreenhouse,
    getActuatorSchedulesByGreenhouse,
    createActuatorSchedule,
    deleteActuatorSchedule,
    getEffectiveUser,
} from "../services/apiClient";

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

    // ───── Generare ore + minute din 5 în 5 minute ─────
    const generateTimeOptions = () => {
        const options = [];
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 5) {
                const hourStr = h.toString().padStart(2, "0");
                const minStr = m.toString().padStart(2, "0");
                options.push(`${hourStr}:${minStr}`);
            }
        }
        return options;
    };
    const timeOptions = generateTimeOptions();

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
                style={styles.sensorBadge}
                onPress={() => setModalVisible(true)}
            >
                <MaterialCommunityIcons name="clock-outline" size={18} color="#333" />
                <Text style={styles.sensorText}>Automatizare actuatoare</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modal}>
                    <View style={styles.modalBox}>
                        <Text style={styles.title}>Automatizare actuatoare</Text>
                        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                            <Text>Alege actuatorul:</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedActuator}
                                    onValueChange={(value) => setSelectedActuator(value)}
                                    style={[styles.picker, Platform.OS === "ios" && styles.iosPicker]}
                                    itemStyle={Platform.OS === "ios" && styles.iosPickerItem}
                                >
                                    <Picker.Item label="Selectează..." value={null} />
                                    {actuators.map((a) => (
                                        <Picker.Item key={a.id} label={a.name} value={a.id} />
                                    ))}
                                </Picker>
                            </View>

                            <Text>Ora de pornire:</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={startTime}
                                    onValueChange={(value) => setStartTime(value)}
                                    style={[styles.picker, Platform.OS === "ios" && styles.iosPicker]}
                                    itemStyle={Platform.OS === "ios" && styles.iosPickerItem}
                                >
                                    {timeOptions.map((t) => (
                                        <Picker.Item key={t} label={t} value={t} />
                                    ))}
                                </Picker>
                            </View>

                            <Text>Ora de oprire:</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={endTime}
                                    onValueChange={(value) => setEndTime(value)}
                                    style={[styles.picker, Platform.OS === "ios" && styles.iosPicker]}
                                    itemStyle={Platform.OS === "ios" && styles.iosPickerItem}
                                >
                                    {timeOptions.map((t) => (
                                        <Picker.Item key={t} label={t} value={t} />
                                    ))}
                                </Picker>
                            </View>

                            <View style={styles.buttonRow}>
                                <Pressable style={styles.button} onPress={handleSetFavorite}>
                                    <Text style={styles.buttonText}>Setează</Text>
                                </Pressable>
                                <Pressable style={styles.button} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.buttonText}>Ieșire</Text>
                                </Pressable>
                            </View>

                            {/* Tabel programări */}
                            {schedules.length > 0 && (
                                <View style={styles.scheduleTable}>
                                    <View style={[styles.tableRow, styles.tableHeader]}>
                                        <Text style={[styles.actuatorcell, styles.headerText]}>Actuator</Text>
                                        <Text style={[styles.datacell, styles.headerText]}>Data</Text>
                                        <Text style={[styles.oncell, styles.headerText]}>Pornire</Text>
                                        <Text style={[styles.offcell, styles.headerText]}>Oprire</Text>
                                        <Text style={[styles.deletecell, styles.headerText]}></Text>
                                    </View>

                                    {schedules.map((f) => (
                                        <View key={f.id} style={styles.tableRow}>
                                            <Text style={styles.cell}>
                                                {actuators.find((a) => a.id === f.actuator_id)?.name || f.actuator_id}
                                            </Text>
                                            <Text style={styles.cell}>{formatDate(f.schedule_date)}</Text>
                                            <Text style={styles.cell}>{f.start_time.slice(0, 5)}</Text>
                                            <Text style={styles.cell}>{f.end_time.slice(0, 5)}</Text>
                                            <TouchableOpacity
                                                style={styles.deleteCell}
                                                onPress={() => handleDeleteFavorite(f.id)}
                                            >
                                                <MaterialCommunityIcons name="close" size={20} color="red" />
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
    modal: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
    modalBox: { backgroundColor: "#AFD6B1", padding: 20, borderRadius: 10, width: 340 },
    title: { fontWeight: "bold", marginBottom: 10, textAlign: "center" },
    buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
    button: { flex: 1, marginHorizontal: 5, padding: 10, backgroundColor: "#fff", borderRadius: 6, alignItems: "center" },
    buttonText: { fontWeight: "bold" },
    sensorBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.3)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 4, marginBottom: 4 },
    sensorText: { marginLeft: 4, fontSize: 14, color: "#333" },
    pickerContainer: { borderWidth: 0, borderRadius: 4, backgroundColor: "#AFD6B1", marginBottom: 12, ...Platform.select({ ios: { height: 50, justifyContent: "center" } }) },
    picker: { height: 50, width: "100%", color: "black" },
    iosPicker: { height: 50, marginHorizontal: 0, color: "black" },
    iosPickerItem: { height: 50, fontSize: 16, textAlign: "center", fontWeight: "normal", color: "black" },
    scheduleTable: { marginTop: 15, paddingHorizontal: 5 },
    tableRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
    tableHeader: { marginBottom: 4 },
    cell: { flex: 1, textAlign: "center" },
    headerText: { fontWeight: "bold" },
    actuatorcell: { flex: 2, textAlign: "left", paddingHorizontal: 5 },
    datacell: { flex: 1, textAlign: "left", marginLeft: -45 },
    oncell: { flex: 1, textAlign: "left" },
    offcell: { flex: 1, textAlign: "left", paddingLeft: 10 },
    deletecell: { width: 15, alignItems: "flex-end" },
    deleteCell: { width: 25, alignItems: "center" },
});

export default FavoriteHours;
