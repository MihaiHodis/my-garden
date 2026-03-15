// assets/settings-icons/icons.js - React Native SVG Icons
import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

export const PersonIcon = ({ style, size = 24 }) => (
  <Svg
    width={size}
    height={size}
    fill={style?.color || "currentColor"}
    viewBox="0 0 24 24"
  >
    <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </Svg>
);

export const AppsIcon = ({ style, size = 24 }) => (
  <Svg
    width={size}
    height={size}
    fill={style?.color || "currentColor"}
    viewBox="0 0 24 24"
  >
    <Path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
  </Svg>
);

export const LogoutIcon = ({ style, size = 24 }) => (
  <Svg
    width={size}
    height={size}
    fill={style?.color || "currentColor"}
    viewBox="0 0 24 24"
  >
    <Path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
  </Svg>
);

export const ChevronRightIcon = ({ style, size = 24 }) => (
  <Svg
    width={size}
    height={size}
    fill={style?.color || "currentColor"}
    viewBox="0 0 24 24"
  >
    <Path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </Svg>
);

export const InfoIcon = ({ style, size = 24 }) => (
  <Svg
    width={size}
    height={size}
    fill={style?.color || "currentColor"}
    viewBox="0 0 24 24"
  >
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </Svg>
);

export const BugReportIcon = ({ style, size = 24 }) => (
  <Svg
    width={size}
    height={size}
    fill={style?.color || "currentColor"}
    viewBox="0 0 24 24"
  >
    <Path d="M20 8H17.19C16.74 7.22 16.12 6.55 15.37 6.04L17 4.41L15.59 3L13.42 5.17C12.96 5.06 12.49 5 12 5C11.51 5 11.04 5.06 10.59 5.17L8.41 3L7 4.41L8.62 6.04C7.88 6.55 7.26 7.22 6.81 8H4V10H6.09C6.04 10.33 6 10.66 6 11V12H4V14H6V15C6 15.34 6.04 15.67 6.09 16H4V18H6.81C7.85 19.79 9.78 21 12 21C14.22 21 16.15 19.79 17.19 18H20V16H17.91C17.96 15.67 18 15.34 18 15V14H20V12H18V11C18 10.66 17.96 10.33 17.91 10H20V8ZM16 15C16 16.66 14.66 18 13 18H11C9.34 18 8 16.66 8 15V11C8 9.34 9.34 8 11 8H13C14.66 8 16 9.34 16 11V15Z" />
    <Circle cx="10" cy="12" r="1.5" />
    <Circle cx="14" cy="12" r="1.5" />
  </Svg>
);

export const GuideIcon = ({ style, size = 24 }) => (
  <Svg
    width={size}
    height={size}
    fill={style?.color || "currentColor"}
    viewBox="0 0 24 24"
  >
    <Path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
  </Svg>
);

export const CheckIcon = ({ style, size = 20 }) => (
  <Svg
    width={size}
    height={size}
    fill={style?.color || "currentColor"}
    viewBox="0 0 24 24"
  >
    <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </Svg>
);

export const ChevronDownIcon = ({ style, size = 20, isOpen = false }) => {
  const rotation = isOpen ? "180deg" : "0deg";
  return (
    <Svg
      width={size}
      height={size}
      fill={style?.color || "currentColor"}
      viewBox="0 0 24 24"
      style={{ transform: [{ rotate: rotation }] }}
    >
      <Path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </Svg>
  );
};

export const EmailIcon = ({ style, size = 16 }) => (
  <Svg
    width={size}
    height={size}
    fill={style?.color || "currentColor"}
    viewBox="0 0 24 24"
  >
    <Path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </Svg>
);

export const WebsiteIcon = ({ style, size = 16 }) => (
  <Svg
    width={size}
    height={size}
    fill={style?.color || "currentColor"}
    viewBox="0 0 24 24"
  >
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </Svg>
);

export const ChevronLeftIcon = ({ style, size = 24 }) => (
  <Svg
    width={size}
    height={size}
    fill={style?.color || "currentColor"}
    viewBox="0 0 24 24"
  >
    <Path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </Svg>
);

export const EditIcon = ({ style, size = 18 }) => (
  <Svg
    width={size}
    height={size}
    fill={style?.color || "currentColor"}
    viewBox="0 0 24 24"
  >
    <Path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </Svg>
);

export const SaveIcon = ({ style, size = 18 }) => (
  <Svg
    width={size}
    height={size}
    fill={style?.color || "currentColor"}
    viewBox="0 0 24 24"
  >
    <Path d="M17 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
  </Svg>
);

export const CancelIcon = ({ style, size = 18 }) => (
  <Svg
    width={size}
    height={size}
    fill={style?.color || "currentColor"}
    viewBox="0 0 24 24"
  >
    <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </Svg>
);

export const DeleteIcon = ({ style, size = 18 }) => (
  <Svg
    width={size}
    height={size}
    fill={style?.color || "currentColor"}
    viewBox="0 0 24 24"
  >
    <Path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </Svg>
);

export const UserIcon = ({ style, size = 60 }) => (
  <Svg
    width={size}
    height={size}
    fill={style?.color || "currentColor"}
    viewBox="0 0 24 24"
  >
    <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </Svg>
);

export const ArrowBackIcon = ({ style, size = 24 }) => (
  <Svg
    width={size}
    height={size}
    fill={style?.color || "currentColor"}
    viewBox="0 0 24 24"
  >
    <Path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" />
  </Svg>
);

export const SendIcon = ({ style, size = 24 }) => (
  <Svg
    width={size}
    height={size}
    fill={style?.color || "currentColor"}
    viewBox="0 0 24 24"
  >
    <Path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" />
  </Svg>
);
