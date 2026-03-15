import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import Toast from 'react-native-toast-message';
import { CheckCircleIcon } from '../assets/settings-icons/moduleIcons';

// The props from the library include 'isVisible'
const ModalToast = ({ text1, text2, isVisible }) => {
  // Re-enabled logging
  console.log(`[2] toastConfig.js: ModalToast rendering with isVisible: ${isVisible}`);

  const handleDismiss = () => {
    // Re-enabled logging
    console.log("[3] toastConfig.js: A tap was registered. Calling Toast.hide()...");
    Toast.hide();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleDismiss}
    >
      {/* This single Touchable now covers the entire screen */}
      <TouchableWithoutFeedback onPress={handleDismiss}>
        <View style={styles.overlay}>
          {/*
            The white content box is now just a View. It will no longer
            block taps from reaching the parent TouchableWithoutFeedback.
          */}
          <View style={styles.container}>
            <View style={styles.iconContainer}>
              <CheckCircleIcon size={48} style={{ color: '#4caf50' }} />
            </View>
            <Text style={styles.title}>{text1}</Text>
            <Text style={styles.message}>{text2}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export const toastConfig = {
  // Pass all props down to our component
  modal: (props) => <ModalToast {...props} />,
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 340,
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    alignItems: 'center',
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});