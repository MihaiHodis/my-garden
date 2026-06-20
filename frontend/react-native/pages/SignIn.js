import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { colors, typography, spacing, radius, elevation } from "../components/GlobalStyles/theme";

// Receive `onLoginSuccess` as a prop
export default function SignIn({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Te rog să completezi toate câmpurile.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // On success, call the function passed from App.js
      // This will set the `showWelcome` state to true
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      setError("Parola sau email-ul incorecte.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingContainer}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('../assets/mygarden-logo.png')}
          style={styles.logo}
        />
        <View style={styles.card}>
          <Text style={styles.eyebrow}>BINE AI VENIT</Text>
          <Text style={styles.heading}>Autentificare</Text>

          <View style={styles.inputRow}>
            <MaterialCommunityIcons name="email-outline" size={20} color={colors.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputRow}>
            <MaterialCommunityIcons name="lock-outline" size={20} color={colors.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder="Parola"
              placeholderTextColor={colors.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
              <MaterialCommunityIcons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <MaterialCommunityIcons name="alert-circle-outline" size={16} color={colors.error} />
              <Text style={styles.error}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Conectează-te</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.placeholderDelete}>
          email - test@test.test parola - test1234
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  logo: {
    width: 300,
    height: 78,
    resizeMode: 'contain',
    marginBottom: spacing.md,
  },
  card: {
    width: "100%",
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingBottom: spacing.xl,
    ...elevation.card,
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.accentText,
    textAlign: "center",
  },
  heading: {
    ...typography.title,
    color: colors.primary,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm,
    marginLeft: spacing.xs,
    ...typography.body,
    fontSize: 16,
    color: colors.textPrimary,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xxs,
    marginBottom: spacing.sm,
  },
  error: {
    ...typography.caption,
    color: colors.error,
    textAlign: "center",
  },
  placeholderDelete: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.lg,
    textAlign: "center",
    fontStyle: 'italic',
    fontSize: 11,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: "center",
  },
  buttonText: {
    ...typography.subtitle,
    color: colors.textOnDark,
  },
});
