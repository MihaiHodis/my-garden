// assets/module-icons/moduleIcons.js
import React from "react";
import Svg, {
  Path,
  Circle,
  Rect,
  Ellipse,
  G,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";

// Light Icon - Represents LED/Light sensors
export const LightIcon = ({ size = 24, style = {} }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
    <Path
      d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Pump Icon - Water pump/irrigation
export const PumpIcon = ({ size = 24, style = {} }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M12 2L8 6H16L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="13" r="7" stroke="currentColor" strokeWidth="2" />
    <Path d="M12 9V17" stroke="currentColor" strokeWidth="2" />
    <Path d="M8 13H16" stroke="currentColor" strokeWidth="2" />
    <Path
      d="M2 20L4 22M20 20L22 22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Ventilation Icon - Fan/Air circulation
export const VentilationIcon = ({ size = 24, style = {} }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <Path
      d="M12 8C13.5 8 15 9 15.5 10.5C16 12 15 13.5 13.5 14C12 14.5 10.5 13.5 10 12C9.5 10.5 10.5 9 12 8Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <Path
      d="M12 6V2M12 22V18M18 12H22M2 12H6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M17.5 6.5L15.5 8.5M8.5 15.5L6.5 17.5M17.5 17.5L15.5 15.5M8.5 8.5L6.5 6.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Temperature Icon - Thermometer
export const TemperatureIcon = ({ size = 24, style = {} }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M14 4V10.54A4 4 0 1 1 10 10.54V4A2 2 0 1 1 14 4Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <Circle cx="12" cy="15" r="2" fill="currentColor" />
    <Path
      d="M12 6H13M12 8H13M12 10H13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Humidity Icon - Water droplet/moisture in air
export const HumidityIcon = ({ size = 24, style = {} }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M12 2.69L17.66 8.35C19.78 10.47 19.78 13.86 17.66 15.98C15.54 18.1 12.15 18.1 10.03 15.98C7.91 13.86 7.91 10.47 10.03 8.35L12 2.69Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <Path
      d="M6 16C4 18 4 21 6 23M18 16C20 18 20 21 18 23"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Circle cx="12" cy="12" r="1" fill="currentColor" />
  </Svg>
);

// Soil Humidity Icon - Plant with water/moisture in soil
export const SoilHumidityIcon = ({ size = 24, style = {} }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M12 2C13 4 13 6 12 8C11 6 11 4 12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path d="M8 8C10 9 14 9 16 8" stroke="currentColor" strokeWidth="1.5" />
    <Path d="M7 12C9 13 15 13 17 12" stroke="currentColor" strokeWidth="1.5" />
    <Rect
      x="2"
      y="18"
      width="20"
      height="4"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <Circle cx="5" cy="20" r="0.5" fill="currentColor" />
    <Circle cx="8" cy="20" r="0.5" fill="currentColor" />
    <Circle cx="11" cy="20" r="0.5" fill="currentColor" />
    <Circle cx="14" cy="20" r="0.5" fill="currentColor" />
    <Circle cx="17" cy="20" r="0.5" fill="currentColor" />
    <Circle cx="20" cy="20" r="0.5" fill="currentColor" />
    <Path d="M9 15C10 16 14 16 15 15" stroke="currentColor" strokeWidth="1.5" />
  </Svg>
);

// Tutorial Step Icons
export const CheckCircleIcon = ({ size = 24, style = {} }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <Path
      d="M9 12L11 14L15 10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const AlertCircleIcon = ({ size = 24, style = {} }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <Path
      d="M12 8V12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Circle cx="12" cy="16" r="1" fill="currentColor" />
  </Svg>
);

export const InfoIcon = ({ size = 24, style = {} }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <Path
      d="M12 16V12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Circle cx="12" cy="8" r="1" fill="currentColor" />
  </Svg>
);

export const ToolsIcon = ({ size = 24, style = {} }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M14.7 6.3A1 1 0 0 0 13.6 5.2L13 5.9A5 5 0 0 0 5 14L8.9 18C9.4 18.5 10.1 18.5 10.6 18L18 10.6C18.5 10.1 18.5 9.4 18 8.9L14.7 6.3Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <Path d="M9.2 15.8L15.8 9.2" stroke="currentColor" strokeWidth="2" />
    <Path
      d="M17.5 6.5L17.5 6.5M20.5 3.5L20.5 3.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M6.5 17.5L3.5 20.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);
