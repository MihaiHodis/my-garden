import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getEffectiveUser, getUserById, syncUser } from '../services/apiClient';
import { colors, typography, spacing, radius, elevation } from '../components/GlobalStyles/theme';

const avatarMap = {
  'avatar_1.png': require('../assets/avatars/avatar_1.png'),
  'avatar_2.png': require('../assets/avatars/avatar_2.png'),
  'avatar_3.png': require('../assets/avatars/avatar_3.png'),
  'avatar_4.png': require('../assets/avatars/avatar_4.png'),
  'avatar_5.png': require('../assets/avatars/avatar_5.png'),
  'avatar_6.png': require('../assets/avatars/avatar_6.png'),
  'Den.jpg': require('../assets/avatars/Den.jpg'),
};

// Receive `onWelcomeFinish` as a prop
const WelcomeScreen = ({ onWelcomeFinish }) => {
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  // Signature: a thin chlorophyll-lime "growth line" that fills in on entry.
  const growthAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const fetchUserData = async () => {
      // 🔹 Wait up to 3 seconds for Firebase to report the user
      let currentUser = getEffectiveUser();
      let attempts = 0;

      while (!currentUser && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 300));
        currentUser = getEffectiveUser();
        attempts++;
      }

      if (currentUser) {
        try {
          console.log("WelcomeScreen: User found, starting sync for:", currentUser.email);

          // 1. Sync user with DB (creates entry if missing)
          const syncResponse = await syncUser();
          console.log("WelcomeScreen: Sync successful", syncResponse.status);

          // 2. Fetch the newly created/existing user data
          const response = await getUserById(currentUser.uid);
          setUserData(response.data);
        } catch (error) {
          console.error("WelcomeScreen: Failed to sync or fetch user data", error.message);
          // Fallback so the user isn't stuck on a loading screen
          setUserData({ nickname: currentUser.email?.split('@')[0] || 'Utilizator', avatar: 'avatar_1.png' });
        } finally {
          setLoading(false);
        }
      } else {
        console.error("WelcomeScreen: No user found after waiting.");
        if (onWelcomeFinish) onWelcomeFinish();
      }
    };

    fetchUserData();
  }, []);

  React.useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(growthAnim, {
          toValue: 1,
          duration: 1100,
          delay: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        // After the delay, call the function from App.js to switch to the main app
        if (onWelcomeFinish) {
          onWelcomeFinish();
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [loading, onWelcomeFinish, fadeAnim, slideAnim, growthAnim]);

  return (
    <LinearGradient
      colors={[colors.surfaceMuted, colors.background]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.container}
    >
      {loading ? (
        <ActivityIndicator size="large" color={colors.primaryMuted} />
      ) : (
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Image source={require('../assets/mygarden-logo.png')} style={styles.logo} />

          <Text style={styles.eyebrow}>BINE AI REVENIT</Text>
          <Text style={styles.greetingText}>Salut,</Text>

          <View style={styles.userInfo}>
            <Image
              source={avatarMap[userData?.avatar] || avatarMap['avatar_1.png']}
              style={styles.avatar}
            />
            <Text style={styles.nicknameText}>{userData?.nickname}</Text>
          </View>

          {/* Signature: growth line that fills left-to-right */}
          <View style={styles.growthTrack}>
            <Animated.View
              style={[
                styles.growthFill,
                { transform: [{ scaleX: growthAnim }] },
              ]}
            />
          </View>
        </Animated.View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  logo: {
    width: 300,
    resizeMode: 'contain',
    marginBottom: spacing.xs,
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.accentText,
    marginBottom: spacing.xs,
  },
  greetingText: {
    ...typography.hero,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...elevation.card,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  nicknameText: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  growthTrack: {
    width: 120,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.track,
    marginTop: spacing.lg,
    overflow: 'hidden',
  },
  growthFill: {
    width: '100%',
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    // grow from the left edge instead of the center
    transformOrigin: 'left',
  },
});

export default WelcomeScreen;
