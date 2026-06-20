import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import Toast from 'react-native-toast-message';
import { CheckCircleIcon } from '../assets/settings-icons/moduleIcons';
import { colors, typography, spacing, radius, elevation } from './GlobalStyles/theme';

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
              <CheckCircleIcon size={48} style={{ color: colors.success }} />
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
    backgroundColor: 'rgba(30,70,50,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  container: {
    width: '100%',
    maxWidth: 340,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    ...elevation.raised,
  },
  iconContainer: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.heading,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});