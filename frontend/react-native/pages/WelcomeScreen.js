import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Animated } from 'react-native';
import { getEffectiveUser, getUserById } from '../services/apiClient';

const avatarMap = {
  'avatar_1.png': require('../assets/avatars/avatar_1.png'),
  'avatar_2.png': require('../assets/avatars/avatar_2.png'),
  'avatar_3.png': require('../assets/avatars/avatar_3.png'),
  'avatar_4.png': require('../assets/avatars/avatar_4.png'),
  'avatar_5.png': require('../assets/avatars/avatar_5.png'),
  'avatar_6.png': require('../assets/avatars/avatar_6.png'),
};

// Receive `onWelcomeFinish` as a prop
const WelcomeScreen = ({ onWelcomeFinish }) => {
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    const fetchUserData = async () => {
      // 🔹 Obține utilizatorul logat (Mock în dev, Firebase în prod)
      const currentUser = getEffectiveUser();
      if (currentUser) {
        try {
          const response = await getUserById(currentUser.uid);
          setUserData(response.data);
        } catch (error) {
          console.error("WelcomeScreen: Failed to fetch user data", error);
          setUserData({ nickname: 'Utilizator', avatar: 'avatar_1.png' });
        } finally {
          setLoading(false);
        }
      } else if (onWelcomeFinish) {
          // Fallback if user is somehow null
          onWelcomeFinish();
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
