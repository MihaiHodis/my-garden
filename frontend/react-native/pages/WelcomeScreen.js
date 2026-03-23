import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Animated } from 'react-native';
import { getEffectiveUser, getUserById, syncUser } from '../services/apiClient';

const avatarMap = {
  'avatar_1.png': require('../assets/avatars/avatar_1.png'),
// ... (rest of avatar map)
};

// Receive `onWelcomeFinish` as a prop
const WelcomeScreen = ({ onWelcomeFinish }) => {
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

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
      ]).start();

      const timer = setTimeout(() => {
        // After the delay, call the function from App.js to switch to the main app
        if (onWelcomeFinish) {
          onWelcomeFinish();
        }
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [loading, onWelcomeFinish, fadeAnim, slideAnim]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#AFD6B1" />
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
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <Text style={styles.greetingText}>Salut,</Text>
          <View style={styles.userInfo}>
            <Image 
              source={avatarMap[userData?.avatar] || avatarMap['avatar_1.png']} 
              style={styles.avatar} 
            />
            <Text style={styles.nicknameText}>{userData?.nickname}</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 300,
    resizeMode: 'contain',
    marginBottom: 0,
  },
  greetingText: {
    fontSize: 34,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
    padding: 10,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#AFD6B1',
  },
  nicknameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default WelcomeScreen;
