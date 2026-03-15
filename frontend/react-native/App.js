import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import Toast from "react-native-toast-message";
import { toastConfig } from "./components/toastConfig"; // <-- 1. IMPORT YOUR CUSTOM CONFIG

// Screens
import HomeScreen from "./pages/HomeScreen";
import StatisticsScreen from "./pages/StatisticsScreen";
import SensorsScreen from "./pages/SensorsScreen";
import Settings from "./pages/SettingsPages/Settings";
import About from "./pages/SettingsPages/About";
import Contact from "./pages/SettingsPages/Contact";
import Account from "./pages/SettingsPages/Account";
import Module from "./pages/SettingsPages/Module";
import SignIn from "./pages/SignIn";
import WelcomeScreen from "./pages/WelcomeScreen";

// Wrapper & Navbar
import ScreenWrapper from "./components/ScreenWrapper";

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_700Bold });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // NEW STATE to control the welcome screen flow
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // În development, putem simula un utilizator logat pentru a evita login-ul real
    if (__DEV__) {
      setUser({
        uid: "PTIIEpO4RMNgumt8Jnabe7Tsu2G3",
        email: "testuser@local.test",
        displayName: "Test User",
      });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && !loading) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, loading]);

  if (!fontsLoaded || loading) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            showWelcome ? (
              // If logged in AND showWelcome is true, render ONLY the Welcome screen
              <Stack.Screen name="Welcome">
                {(props) => (
                  <WelcomeScreen
                    {...props}
                    onWelcomeFinish={() => setShowWelcome(false)}
                  />
                )}
              </Stack.Screen>
            ) : (
              // If logged in and welcome is finished, render the main app
              <>
                <Stack.Screen name="Home">
                  {() => (
                    <ScreenWrapper>
                      <HomeScreen />
                    </ScreenWrapper>
                  )}
                </Stack.Screen>
                 <Stack.Screen name="Sensors">
                {() => (
                  <ScreenWrapper>
                    <SensorsScreen />
                  </ScreenWrapper>
                )}
              </Stack.Screen>
              <Stack.Screen name="Statistics">
                {() => (
                  <ScreenWrapper>
                    <StatisticsScreen />
                  </ScreenWrapper>
                )}
              </Stack.Screen>
              <Stack.Screen name="Settings">
                {() => (
                  <ScreenWrapper>
                    <Settings />
                  </ScreenWrapper>
                )}
              </Stack.Screen>
              <Stack.Screen name="About">
                {() => (
                  <ScreenWrapper>
                    <About />
                  </ScreenWrapper>
                )}
              </Stack.Screen>
              <Stack.Screen name="Contact">
                {() => (
                  <ScreenWrapper>
                    <Contact />
                  </ScreenWrapper>
                )}
              </Stack.Screen>
              <Stack.Screen name="Account">
                {() => (
                  <ScreenWrapper>
                    <Account />
                  </ScreenWrapper>
                )}
              </Stack.Screen>
              <Stack.Screen name="Module">
                {() => (
                  <ScreenWrapper>
                    <Module />
                  </ScreenWrapper>
                )}
              </Stack.Screen>
              </>
            )
          ) : (
            // If not logged in, render the SignIn screen
            <Stack.Screen name="SignIn">
              {(props) => (
                <SignIn
                  {...props}
                  onLoginSuccess={() => setShowWelcome(true)}
                />
              )}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      
      {/* 2. PASS THE CONFIG TO THE TOAST COMPONENT */}
      <Toast config={toastConfig} />
    </SafeAreaProvider>
  );
}