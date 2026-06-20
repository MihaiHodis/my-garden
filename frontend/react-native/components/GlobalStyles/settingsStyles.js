// components/settings_components/settingsStyles.js - React Native Settings Styles
import { StyleSheet, Dimensions } from "react-native";
import { colors, fonts, radius } from "./theme";

const { width: screenWidth } = Dimensions.get("window");

export const settingsStyles = StyleSheet.create({
  // Layout Styles
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },

  maxWidthContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignSelf: "center",
    paddingHorizontal: 16,
    width: "100%",
    zIndex: 1000,
    backgroundColor: colors.surface, // Add background to prevent content showing through
  },

  maxWidthContainerScroll: {
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 150,
    paddingBottom: 150,
    height: "100%",
    width: "100%",
  },

  paper: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // Android shadow
    marginBottom: 16,
    overflow: "hidden",
    zIndex: 1000,
  },

  // Header Styles
  headerBox: {
    padding: 24,
    backgroundColor: "rgba(175, 214, 177, 1)",
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  headerClickable: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  backIcon: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    zIndex: 1,
  },

  headerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 20, // 1.25rem
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },

  headerSubtitle: {
    fontSize: 14, // 0.875rem
    color: colors.textPrimary,
    opacity: 0.9,
    textAlign: "center",
    paddingHorizontal: 20, // To avoid overlap with back icon
  },

  // Content Styles
  contentBox: {
    padding: 24,
  },

  // Profile Section Styles
  profileSection: {
    alignItems: "center",
    marginBottom: 32,
  },

  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  profileName: {
    fontSize: 24, // 1.5rem
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },

  profileEmail: {
    fontSize: 14, // 0.875rem
    color: colors.textSecondary,
    textAlign: "center",
  },

  // Form Field Styles
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
  },

  fieldContainer: {
    flex: 1,
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
    marginBottom: 4,
  },

  fieldEditContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  fieldDisplayContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  fieldValue: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textPrimary,
  },

  fieldValueEmail: {
    fontSize: 16,
    color: colors.textPrimary,
  },

  // Input Styles
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    fontSize: 16,
    marginRight: 8,
    backgroundColor: colors.surface,
  },

  // Button Styles - Base
  buttonBase: {
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "500",
  },

  buttonIcon: {
    marginRight: 4,
  },

  // Button Variants
  editButton: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  editButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "500",
  },

  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },

  saveButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "500",
  },

  cancelButton: {
    backgroundColor: colors.textSecondary,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  cancelButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "500",
  },

  deleteButton: {
    backgroundColor: colors.error,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  deleteButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "500",
  },

  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  retryButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "500",
  },

  // Avatar Selection Styles
  avatarSelectionSection: {
    marginTop: 32,
  },

  avatarSelectionLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 16,
  },

  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
  },

  avatarGridItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 80,
    marginBottom: 16,
    marginHorizontal: 8,
  },

  avatarGridItemSelected: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: 'rgba(168,216,74,0.18)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    minWidth: 80,
    marginBottom: 16,
    marginHorizontal: 8,
  },

  // Loading and Error Styles
  loadingContainer: {
    padding: 24,
    alignItems: "center",
  },

  loadingSkeletonAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surfaceMuted,
    marginBottom: 20,
  },

  loadingSkeletonName: {
    width: 150,
    height: 24,
    backgroundColor: colors.surfaceMuted,
    marginBottom: 8,
    borderRadius: 4,
  },

  loadingSkeletonEmail: {
    width: 200,
    height: 16,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 4,
  },

  errorContainer: {
    alignItems: "center",
    padding: 40,
  },

  errorMessage: {
    color: colors.error,
    marginBottom: 16,
    textAlign: "center",
    fontSize: 16,
  },

  errorAlert: {
    backgroundColor: 'rgba(192,73,47,0.12)',
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 8,
    padding: 12,
    width: "100%",
  },

  errorAlertText: {
    color: colors.error,
    fontSize: 14,
    textAlign: "center",
  },

  // Delete Account Section
  deleteAccountSection: {
    marginTop: 40,
    alignItems: "center",
  },

  // Footer Styles
  footer: {
    alignItems: "center",
    marginTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 16,
  },

  footerText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textTertiary,
    textAlign: "center",
  },

  // Avatar Component Styles
  avatarWrapper: {
    borderRadius: 60, // Will be adjusted based on size
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.border,
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  avatarFallback: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },

  // Additional utility styles
  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  spaceBetween: {
    justifyContent: "space-between",
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
  },

  textCenter: {
    textAlign: "center",
  },

  flex1: {
    flex: 1,
  },
  fieldInputEditing: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  nicknameActions: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "flex-end",
    gap: 10,
  },

  // Responsive avatar grid
  avatarGridResponsive: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: screenWidth < 400 ? "space-around" : "space-between",
    padding: 20,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
  },
});

// About Page Specific Styles
export const aboutStyles = StyleSheet.create({
  // About page specific styles (reusing common styles from settingsStyles)

  // Override paper margin for About page
  aboutPaper: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 24, // Larger margin for About page
    overflow: "hidden",
  },

  // Header back icon specific positioning for About page
  aboutBackIcon: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    zIndex: 1,
  },

  // Section header styles
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionHeaderText: {
    fontSize: 20, // 1.25rem
    fontWeight: "600",
    marginLeft: 8,
    color: colors.textPrimary,
    textAlign: "center",
    flex: 1,
  },

  // Description text styles
  descriptionText: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24, // 1.6 line height
    color: colors.textPrimary,
    textAlign: "center",
  },

  descriptionSecondaryText: {
    fontSize: 16,
    lineHeight: 24, // 1.6 line height
    color: colors.textSecondary,
    textAlign: "center",
  },

  // Dropdown/Expandable styles
  dropdownItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 8,
  },

  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },

  dropdownHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },

  dropdownHeaderText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textPrimary,
    textAlign: "center",
    flex: 1,
  },

  dropdownContent: {
    paddingBottom: 12,
  },

  dropdownContentText: {
    fontSize: 14, // 0.875rem
    color: colors.textSecondary,
    lineHeight: 22, // 1.6 line height
    textAlign: "center",
  },

  // Version container styles
  versionContainer: {
    alignItems: "center",
  },

  versionLabel: {
    fontSize: 14, // 0.875rem
    color: colors.textSecondary,
    marginBottom: 8,
  },

  versionNumber: {
    fontSize: 14.4, // 0.9rem
    fontWeight: "600",
    color: colors.primary,
  },
});

// Avatar size function (replaces the dynamic sizing from web)
export const getAvatarStyle = (size) => ({
  width: size,
  height: size,
  borderRadius: size / 2,
  backgroundColor: colors.surfaceMuted,
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  borderWidth: 2,
  borderColor: colors.border,
});

// Color constants
export const settingsColors = {
  primary: colors.primary,
  background: colors.background,
  surface: colors.surface,
  error: colors.error,
  textPrimary: colors.textPrimary,
  textSecondary: colors.textSecondary,
  textTertiary: colors.textTertiary,
  border: colors.border,
  inputBorder: colors.border,
  success: colors.success,
  warning: colors.warning,
  info: colors.info,
  light: colors.surfaceMuted,
  dark: colors.bark,
};

// Animation helper (since CSS animations don't work in RN)
export const createPulseAnimation = () => {
  // You would need to implement this using Animated API
  // This is a placeholder for the pulse animation logic
  return {
    // Animated.loop implementation would go here
    // for the loading skeleton pulse effect
  };
};

// Contact Page Specific Styles
export const contactStyles = StyleSheet.create({
  // Form styles
  formContainer: {
    gap: 24, // spacing between form elements
  },

  formContainerNoGap: {
    // Alternative for older RN versions
  },

  formField: {
    marginBottom: 24,
  },

  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
  },

  textInputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },

  textInputMultiline: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    textAlignVertical: "top", // Android alignment for multiline
    minHeight: 120, // Equivalent to 6 rows
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
    marginBottom: 8,
  },

  inputLabelRequired: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
    marginBottom: 8,
  },

  // Picker/Dropdown styles
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },

  pickerContainerFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },

  picker: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
  },

  // Custom dropdown styles (if needed)
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },

  dropdownButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
  },

  dropdownButtonPlaceholder: {
    fontSize: 16,
    color: colors.textTertiary,
  },

  // Submit button styles
  submitButton: {
    backgroundColor: "rgba(175, 214, 177, 1)",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },

  submitButtonDisabled: {
    backgroundColor: colors.border,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },

  submitButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },

  submitButtonTextDisabled: {
    color: colors.textTertiary,
    fontSize: 16,
    fontWeight: "600",
  },

  // Alert/Message styles
  alertContainer: {
    marginBottom: 24,
  },

  alertSuccess: {
    backgroundColor: 'rgba(74,122,82,0.14)',
    borderColor: colors.success,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },

  alertError: {
    backgroundColor: 'rgba(192,73,47,0.12)',
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },

  alertText: {
    fontSize: 14,
    textAlign: "center",
  },

  alertTextSuccess: {
    color: colors.success,
  },

  alertTextError: {
    color: colors.error,
  },

  // Contact info styles
  contactInfoText: {
    fontSize: 14, // 0.875rem
    color: colors.textSecondary,
    marginBottom: 12,
  },

  contactInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 8,
  },

  contactInfoValue: {
    fontSize: 14, // 0.875rem
    color: colors.textPrimary,
    fontWeight: "500",
  },

  // Form validation styles
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },

  requiredAsterisk: {
    color: colors.error,
  },
});

// Main Settings UI Styles (for settings list layout)
export const settingsUIStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollView: {
    flex: 1,
    paddingTop: 5,
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 50,
  },

  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.canopy,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
    overflow: "hidden",
  },

  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },

  activeItem: {
    backgroundColor: colors.surfaceMuted,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },

  iconContainer: {
    width: 56,
    alignItems: "flex-start",
  },

  textContainer: {
    flex: 1,
    marginLeft: 0,
  },

  primaryText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 2,
  },

  logoutText: {
    color: colors.error,
  },

  secondaryText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
  },

  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: 72, // Align with text, accounting for icon space
  },
});

// Account Page Specific Styles
export const accountStyles = StyleSheet.create({
  // Profile section
  profileSection: {
    alignItems: "center",
    marginBottom: 32,
  },

  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  profileName: {
    fontSize: 24, // 1.5rem
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
    color: colors.textPrimary,
  },

  profileEmail: {
    fontSize: 14, // 0.875rem
    color: colors.textSecondary,
    textAlign: "center",
  },

  // Avatar component styles
  avatarWrapper: {
    borderRadius: 60, // Will be adjusted based on size
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.border,
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  avatarFallback: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },

  // Field editing styles
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
  },

  fieldContainer: {
    flex: 1,
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
    marginBottom: 4,
  },

  fieldEditContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  fieldDisplayContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  fieldValue: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textPrimary,
  },

  fieldValueEmail: {
    fontSize: 16,
    color: colors.textPrimary,
  },

  // Input styles
  fieldInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    fontSize: 16,
    marginRight: 8,
    backgroundColor: colors.surface,
  },

  // Button styles for field editing
  fieldEditButton: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  fieldEditButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },

  fieldSaveButton: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 50,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },

  fieldSaveButtonDisabled: {
    backgroundColor: colors.border,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 50,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },

  fieldSaveButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "500",
  },

  fieldCancelButton: {
    backgroundColor: colors.textSecondary,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 50,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  fieldCancelButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "500",
  },

  // Avatar selection styles
  avatarSelectionSection: {
    marginTop: 32,
  },

  avatarSelectionLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 16,
    textAlign: "center",
  },

  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
  },

  avatarGridItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 80,
    marginBottom: 16,
    marginHorizontal: 8,
  },

  avatarGridItemSelected: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: 'rgba(168,216,74,0.18)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    minWidth: 80,
    marginBottom: 16,
    marginHorizontal: 8,
  },

  // Loading states
  loadingContainer: {
    padding: 24,
    alignItems: "center",
  },

  loadingSkeletonAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surfaceMuted,
    marginBottom: 20,
  },

  loadingSkeletonName: {
    width: 150,
    height: 24,
    backgroundColor: colors.surfaceMuted,
    marginBottom: 8,
    borderRadius: 4,
  },

  loadingSkeletonEmail: {
    width: 200,
    height: 16,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 4,
  },

  // Error states
  errorContainer: {
    alignItems: "center",
    padding: 40,
  },

  errorMessage: {
    color: colors.error,
    marginBottom: 16,
    textAlign: "center",
    fontSize: 16,
  },

  errorAlert: {
    backgroundColor: 'rgba(192,73,47,0.12)',
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 8,
    padding: 12,
    width: "100%",
  },

  errorAlertText: {
    color: colors.error,
    fontSize: 14,
    textAlign: "center",
  },

  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  retryButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "500",
  },

  // Delete account section
  deleteAccountSection: {
    marginTop: 40,
    alignItems: "center",
  },

  deleteButton: {
    backgroundColor: colors.error,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  deleteButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
});

// Add these styles to the bottom of your components/settings_components/settingsStyles.js file

// Module Page Specific Styles
export const moduleStyles = StyleSheet.create({
  // Contact Support Section
  contactSupportSection: {
    alignItems: "center",
    paddingVertical: 8,
  },

  contactSupportTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },

  contactSupportDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 16,
  },

  contactSupportButton: {
    backgroundColor: 'rgba(175, 214, 177, 1)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
    minWidth: 200,
    alignItems: "center",
  },

  contactSupportButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  // Main Categories Section
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 20,
    textAlign: "center",
  },

  categoriesContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.surface,
    minHeight: 80,
  },

  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  categoryTextContainer: {
    flex: 1,
    paddingRight: 12,
  },

  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 4,
  },

  categoryDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  categoryArrow: {
    padding: 8,
  },

  categoryDivider: {
    height: 1,
    backgroundColor: colors.surfaceMuted,
    marginLeft: 92, // Icon width + margin + padding
  },

  // Info Section
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 12,
    alignContent: "center",
    textAlign: "center",
  },

  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    alignContent: "center",
    textAlign: "center",
  },

  // Tutorial Progress
  progressContainer: {
    alignItems: "center",
    marginBottom: 10,
  },

  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: colors.success,
    borderRadius: 4,
  },

  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },

  // Steps Overview
  stepsOverview: {
    marginTop: 16,
  },

  stepOverviewItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },

  stepIndicator: {
    alignItems: "center",
    marginRight: 16,
  },

  stepIndicatorActive: {
    transform: [{ scale: 1.1 }],
  },

  stepIndicatorCompleted: {
    transform: [{ scale: 1.0 }],
  },

  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  stepNumber: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textTertiary,
  },

  stepNumberActive: {
    color: colors.primary,
  },

  stepNumberCompleted: {
    color: colors.success,
  },

  stepTitle: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "500",
    flex: 1,
  },

  stepTitleActive: {
    color: colors.primary,
    fontWeight: "600",
  },

  // Current Step Details
  currentStepHeader: {
    marginBottom: 20,
    alignItems: "center",
  },

  currentStepNumber: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },

  currentStepTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
  },

  stepContent: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: "justify",
  },

  // Tips Section
  tipsContainer: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(175, 214, 177, 1)',
  },

  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 12,
  },

  tipText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
    paddingLeft: 8,
  },

  // Complete Step Button
  completeStepButton: {
    backgroundColor: colors.success,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  completedStepButton: {
    backgroundColor: colors.primary,
  },

  completeStepButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },

  completedStepButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },

  // Navigation Buttons
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  navButton: {
    flex: 0.48,
    backgroundColor: 'rgba(175, 214, 177, 1)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },

  navButtonDisabled: {
    backgroundColor: colors.border,
  },

  navButtonText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  },

  navButtonTextDisabled: {
    color: colors.textTertiary,
  },
});

export default settingsStyles;
