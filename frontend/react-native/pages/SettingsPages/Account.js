// Enhanced Account.js with better debugging and error handling

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message"; // <-- IMPORT TOAST

import {
  settingsStyles,
  accountStyles,
} from "../../components/GlobalStyles/settingsStyles";

import { ChevronLeftIcon, UserIcon } from "../../assets/settings-icons/icons";

// Import the enhanced API functions
import {
  getUserById,
  updateUserById,
  testConnection,
  updateUserByIdViaPost,
} from "../../services/apiClient";

// Avatar mapping
const avatarMap = {
  "avatar_1.png": require("../../assets/avatars/avatar_1.png"),
  "avatar_2.png": require("../../assets/avatars/avatar_2.png"),
  "avatar_3.png": require("../../assets/avatars/avatar_3.png"),
  "avatar_4.png": require("../../assets/avatars/avatar_4.png"),
  "avatar_5.png": require("../../assets/avatars/avatar_5.png"),
  "avatar_6.png": require("../../assets/avatars/avatar_6.png"),
};

const avatarOptions = [
  "avatar_1.png",
  "avatar_2.png",
  "avatar_3.png",
  "avatar_4.png",
  "avatar_5.png",
  "avatar_6.png",
];

// ... (Avatar component remains the same)
const Avatar = ({ avatarName, size = 90, isSelected = false }) => {
  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: isSelected ? "#2e7d32" : "#e0e0e0",
  };

  const avatarSource = avatarMap[avatarName];

  return (
    <View style={avatarStyle}>
      {avatarSource ? (
        <Image
          source={avatarSource}
          style={accountStyles.avatarImage}
          onError={() => console.log("Avatar image failed to load")}
        />
      ) : (
        <View style={accountStyles.avatarFallback}>
          <UserIcon size={size * 0.6} style={{ color: "#999" }} />
        </View>
      )}
    </View>
  );
};


// ... (NicknameField component remains the same)
const NicknameField = ({
  nickname,
  setNickname,
  userData,
  updateUserData,
  error,
  setError,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleNicknameInputChange = (text) => {
    setNickname(text);
    if (error) setError(null);
  };

  const handleNicknameBlur = async () => {
    if (!userData || nickname.trim() === userData.nickname) {
      setNickname(userData.nickname || "");
      return;
    }

    if (!nickname.trim()) {
      setError("Nickname cannot be empty");
      setNickname(userData.nickname || "");
      return;
    }

    setIsUpdating(true);
    try {
      console.log(
        "Updating nickname from:",
        userData.nickname,
        "to:",
        nickname.trim()
      );
      await updateUserData({ nickname: nickname.trim() });
      setError(null);
      console.log("Nickname update successful");
    } catch (error) {
      console.error("Error updating nickname:", error);
      setError(`Failed to update nickname: ${error.message}`);
      setNickname(userData.nickname || "");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={accountStyles.fieldRow}>
      <View style={accountStyles.fieldContainer}>
        <Text style={accountStyles.fieldLabel}>Nickname</Text>
        <View style={accountStyles.fieldDisplayContainer}>
          <TextInput
            key="nickname-input"
            style={[
              accountStyles.fieldInput,
              isUpdating && { backgroundColor: "#f5f5f5" },
            ]}
            value={nickname}
            onChangeText={handleNicknameInputChange}
            onEndEditing={handleNicknameBlur}
            placeholder="Enter your nickname"
            autoCapitalize="none"
            returnKeyType="done"
            editable={!isUpdating}
          />
          {isUpdating && (
            <ActivityIndicator
              size="small"
              color="#2e7d32"
              style={{ position: "absolute", right: 10, top: 15 }}
            />
          )}
        </View>
      </View>
    </View>
  );
};


const Account = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [nickname, setNickname] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  const HEADER_HEIGHT = 40;

  // ... (All functions like getCurrentUserId, loadUserData, etc. remain the same)
  const getCurrentUserId = () => {
    if (route.params?.userId) return route.params.userId;
    if (route.params?.id) return route.params.id;
    return "1"; // fallback
  };

  const loadUserData = async () => {
    const currentUserId = getCurrentUserId();

    if (!currentUserId) {
      setError("No user ID provided. Please log in again.");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      console.log("=== LOADING USER DATA ===");
      console.log("User ID:", currentUserId);

      const connectionTest = await testConnection();
      console.log("Connection test result:", connectionTest);

      if (!connectionTest) {
        throw new Error("Cannot connect to server");
      }

      const response = await getUserById(currentUserId);
      console.log("User data response:", response);

      if (response && response.data) {
        setUserData(response.data);
        setNickname(response.data.nickname || "");
        setError(null);
        setDebugInfo(`✓ Data loaded for user ${currentUserId}`);
      } else {
        throw new Error("No user data received");
      }
    } catch (e) {
      console.error("=== USER DATA LOAD ERROR ===");
      console.error("Error details:", e);
      console.error("Error message:", e.message);
      console.error("Error response:", e.response);

      let errorMessage = "";
      if (e.response?.status === 404) {
        errorMessage = `User with ID "${currentUserId}" not found in database.`;
      } else if (e.response?.status === 401) {
        errorMessage = "Authentication required. Please log in.";
      } else if (e.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (
        e.code === "ECONNREFUSED" ||
        e.message.includes("Network Error")
      ) {
        errorMessage =
          "Cannot connect to server. Please check your internet connection.";
      } else {
        errorMessage = `Failed to load user data: ${e.message}`;
      }

      setError(errorMessage);
      setDebugInfo(`✗ Error: ${e.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [route.params]);

  const onRefresh = () => {
    setRefreshing(true);
    loadUserData();
  };

  const handleBackToSettings = () => {
    navigation.goBack();
  };

  // Enhanced updateUserData with multiple methods
  const updateUserData = async (updatedFields) => {
    if (!userData) {
      throw new Error("No user data available");
    }

    try {
      console.log("=== UPDATING USER DATA ===");
      console.log("User ID:", userData.id);
      console.log("Update fields:", updatedFields);
      console.log("Current user data:", userData);

      let response;
      try {
        response = await updateUserById(userData.id, updatedFields);
        console.log("✓ Update successful via PATCH/PUT");
      } catch (updateError) {
        console.warn(
          "Standard update failed, trying POST method:",
          updateError.message
        );
        response = await updateUserByIdViaPost(userData.id, updatedFields);
        console.log("✓ Update successful via POST");
      }

      const updatedUser = { ...userData, ...updatedFields };
      setUserData(updatedUser);

      if (updatedFields.nickname) {
        setNickname(updatedFields.nickname);
      }

      setDebugInfo(`✓ Updated: ${Object.keys(updatedFields).join(", ")}`);

      // --- MODERNIZED SUCCESS MESSAGE ---
      console.log("[1] Account.js: Triggering modal toast..."); // <-- ADD THIS LOG
      Toast.show({
        type: 'modal', // <-- Use the new modal type
        text1: 'Success',
        text2: 'Profile updated successfully!',
        autoHide: false, // <-- Important: don't auto-hide
      });

    } catch (error) {
      console.error("=== UPDATE ERROR ===");
      console.error("Error details:", error);
      console.error("Error message:", error.message);
      console.error("Error response:", error.response);

      setDebugInfo(`✗ Update failed: ${error.message}`);
      
      // --- OPTIONAL MODERNIZED ERROR MESSAGE ---
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error.message || 'Could not save your changes.',
      });

      throw error;
    }
  };

  const selectAvatar = async (avatarName) => {
    try {
      console.log("=== SELECTING AVATAR ===");
      console.log("Selected avatar:", avatarName);
      console.log("Current avatar:", userData?.avatar);

      if (userData?.avatar === avatarName) {
        console.log("Same avatar selected, no update needed");
        return;
      }

      await updateUserData({ avatar: avatarName });
      setError(null);
    } catch (error) {
      console.error("Error updating avatar:", error);
      setError(`Failed to update avatar: ${error.message}`);
    }
  };

  // ... (DebugPanel and other components remain the same)
  const DebugPanel = () => (
    <View
      style={{
        backgroundColor: "#f0f0f0",
        padding: 10,
        margin: 10,
        borderRadius: 5,
      }}
    >
      <Text style={{ fontSize: 12, fontFamily: "monospace" }}>
        Debug: {debugInfo}
      </Text>
      <Text style={{ fontSize: 12, fontFamily: "monospace", marginTop: 5 }}>
        User ID: {getCurrentUserId()}
      </Text>
      <Text style={{ fontSize: 12, fontFamily: "monospace", marginTop: 5 }}>
        Server: Local development
      </Text>
      <Text style={{ fontSize: 12, fontFamily: "monospace", marginTop: 5 }}>
        Current Avatar: {userData?.avatar || "none"}
      </Text>
      <Text style={{ fontSize: 12, fontFamily: "monospace", marginTop: 5 }}>
        Current Nickname: {userData?.nickname || "none"}
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: "#2e7d32",
          padding: 8,
          borderRadius: 4,
          marginTop: 10,
          alignItems: "center",
        }}
        onPress={() => {
          console.log("=== MANUAL REFRESH TEST ===");
          loadUserData();
        }}
        activeOpacity={0.8}
      >
        <Text style={{ color: "white", fontSize: 12 }}>
          Refresh from Server
        </Text>
      </TouchableOpacity>
    </View>
  );

  const PageHeader = () => (
    <View style={settingsStyles.maxWidthContainer}>
      <View style={settingsStyles.paper}>
        <TouchableOpacity
          style={settingsStyles.headerBox}
          onPress={handleBackToSettings}
          activeOpacity={0.8}
        >
          <View style={settingsStyles.backIcon}>
            <ChevronLeftIcon size={24} style={{ color: "black" }} />
          </View>
          <View style={settingsStyles.headerContent}>
            <Text style={settingsStyles.headerTitle}>Profil</Text>
            <Text style={settingsStyles.headerSubtitle}>
              Modifică informațiile contului tău
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={settingsStyles.container}>
        <PageHeader />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 50 }}>
            <ActivityIndicator size="large" color="#2e7d32" />
            <Text style={{ marginTop: 8, color: "#666" }}>
              Se încarcă datele utilizatorului...
            </Text>
        </View>
      </View>
    );
  }

  if (error && !userData) {
    return (
      <View style={settingsStyles.container}>
        <PageHeader />
        <ScrollView>
          <View style={settingsStyles.paper}>
            <View style={settingsStyles.contentBox}>
              <View style={accountStyles.errorContainer}>
                <Text style={accountStyles.errorMessage}>{error}</Text>
                <TouchableOpacity
                  style={accountStyles.retryButton}
                  onPress={onRefresh}
                  activeOpacity={0.8}
                >
                  <Text style={accountStyles.retryButtonText}>
                    Încearcă din nou
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <DebugPanel />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={settingsStyles.container}>
      <PageHeader />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={HEADER_HEIGHT}
      >
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyboardShouldPersistTaps="handled"
        >
          <View style={settingsStyles.maxWidthContainerScroll}>
            <View style={settingsStyles.paper}>
              <View style={settingsStyles.contentBox}>
                <View style={accountStyles.profileSection}>
                  <View style={accountStyles.avatarContainer}>
                    <Avatar
                      avatarName={userData?.avatar || "avatar_1.png"}
                      size={120}
                    />
                  </View>
                  <Text style={accountStyles.profileName}>
                    {userData?.nickname || "No nickname set"}
                  </Text>
                </View>

                {error && (
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ color: "red", textAlign: "center" }}>
                      {error}
                    </Text>
                  </View>
                )}

                {userData && (
                  <NicknameField
                    nickname={nickname}
                    setNickname={setNickname}
                    userData={userData}
                    updateUserData={updateUserData}
                    error={error}
                    setError={setError}
                  />
                )}

                {userData && (
                  <View style={accountStyles.avatarSelectionSection}>
                    <Text style={accountStyles.avatarSelectionLabel}>
                      Alege un Avatar
                    </Text>
                    <View style={accountStyles.avatarGrid}>
                      {avatarOptions.map((avatar) => (
                        <TouchableOpacity
                          key={avatar}
                          style={
                            userData.avatar === avatar
                              ? accountStyles.avatarGridItemSelected
                              : accountStyles.avatarGridItem
                          }
                          onPress={() => selectAvatar(avatar)}
                          activeOpacity={0.8}
                        >
                          <Avatar
                            avatarName={avatar}
                            size={60}
                            isSelected={userData.avatar === avatar}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Account;