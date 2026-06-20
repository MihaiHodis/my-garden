// theme.js — single source of truth for the mygarden visual system.
//
// Design direction: a living thing measured by instruments.
//   - Primary mood: organic-natural (soft greens, misted-glass surfaces, warm ink)
//   - Secondary mood: fine tech accents (mono numerals, a single chlorophyll-lime signal)
//
// Use these tokens everywhere instead of raw hex / magic numbers. The legacy
// `settingsColors` object in settingsStyles.js maps onto `colors` below so existing
// screens keep working while we migrate them screen by screen.

// ---------------------------------------------------------------------------
// Color — described as named values, then mapped to semantic roles.
// ---------------------------------------------------------------------------
const palette = {
  canopy: "#1E4632", // deep leaf green — primary
  moss: "#4A7A52", // mid green — secondary / active states
  fern: "#2E7D32", // legacy brand green, kept for continuity
  mist: "#E4EDE0", // misted greenhouse glass — app background (soft sage, clearly not grey)
  dew: "#F7FAF6", // lightest surface tint
  bark: "#2C2A24", // warm near-black — primary text
  glow: "#A8D84A", // chlorophyll lime — the one tech accent, used sparingly
  glowDeep: "#7FB52E", // darker lime for text-on-light contrast
  clay: "#B6754F", // warm soil tone — tertiary warmth
  amber: "#E0A52E", // ripe/warning warmth
  rust: "#C0492F", // error / danger, kept earthy not pure red
};

export const colors = {
  ...palette,

  // Semantic roles ---------------------------------------------------------
  primary: palette.canopy,
  primaryMuted: palette.moss,
  accent: palette.glow, // hairlines, growth bars, active toggles only
  accentText: palette.glowDeep, // lime when it must sit on a light surface

  background: palette.mist,
  surface: "#FFFFFF",
  surfaceMuted: palette.dew,
  surfaceInverse: palette.canopy,

  // Text
  textPrimary: palette.bark,
  textSecondary: "rgba(44,42,36,0.66)", // bark @ 66%
  textTertiary: "rgba(44,42,36,0.42)", // bark @ 42%
  textOnDark: "#F1F6EE",
  textOnAccent: palette.canopy,

  // Lines & fills
  border: "rgba(30,70,50,0.12)", // canopy @ 12% — soft hairline
  borderStrong: "rgba(30,70,50,0.24)",
  divider: "rgba(44,42,36,0.08)",
  track: "rgba(30,70,50,0.10)", // empty part of a growth bar

  // Status
  success: palette.moss,
  warning: palette.amber,
  error: palette.rust,
  info: palette.canopy,
};

// ---------------------------------------------------------------------------
// Typography — Fraunces (organic display) + Hanken Grotesk (body) + Space Mono (data).
// fontFamily strings MUST match the keys registered via useFonts in App.js.
// ---------------------------------------------------------------------------
export const fonts = {
  // Display — organic soft serif, used with restraint
  display: "Fraunces_600SemiBold",
  displayBold: "Fraunces_700Bold",
  displayLight: "Fraunces_400Regular",

  // Body — humanist sans
  body: "HankenGrotesk_400Regular",
  bodyMedium: "HankenGrotesk_500Medium",
  bodySemiBold: "HankenGrotesk_600SemiBold",
  bodyBold: "HankenGrotesk_700Bold",

  // Data — mono, the tech accent: sensor values, units, codes
  mono: "SpaceMono_400Regular",
  monoBold: "SpaceMono_700Bold",
};

export const typography = {
  // role: { fontFamily, fontSize, lineHeight, letterSpacing }
  hero: { fontFamily: fonts.displayBold, fontSize: 34, lineHeight: 40, letterSpacing: -0.5 },
  title: { fontFamily: fonts.display, fontSize: 26, lineHeight: 32, letterSpacing: -0.3 },
  heading: { fontFamily: fonts.display, fontSize: 20, lineHeight: 26, letterSpacing: -0.2 },
  subtitle: { fontFamily: fonts.bodySemiBold, fontSize: 17, lineHeight: 24 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: fonts.bodyMedium, fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  // eyebrow — small, tracked-out label above a section/card
  eyebrow: { fontFamily: fonts.bodySemiBold, fontSize: 11, lineHeight: 14, letterSpacing: 1.2 },
  // data — the signature: large mono numerals for readouts
  metric: { fontFamily: fonts.monoBold, fontSize: 30, lineHeight: 34, letterSpacing: -0.5 },
  metricSmall: { fontFamily: fonts.mono, fontSize: 15, lineHeight: 20 },
  unit: { fontFamily: fonts.mono, fontSize: 12, lineHeight: 16, letterSpacing: 0.4 },
};

// ---------------------------------------------------------------------------
// Spacing — 4pt base scale.
// ---------------------------------------------------------------------------
export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ---------------------------------------------------------------------------
// Radius — soft/organic for surfaces, tighter for data chips (tech).
// ---------------------------------------------------------------------------
export const radius = {
  chip: 8, // data chips — slightly crisp = tech
  sm: 12,
  md: 16,
  card: 22, // organic soft cards
  lg: 28,
  pill: 999,
};

// ---------------------------------------------------------------------------
// Elevation — soft, low, green-tinted shadows (organic, not hard tech drop).
// Usage: ...elevation.card
// ---------------------------------------------------------------------------
export const elevation = {
  none: {},
  card: {
    shadowColor: palette.canopy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
  },
  raised: {
    shadowColor: palette.canopy,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 6,
  },
};

const theme = { colors, fonts, typography, spacing, radius, elevation };
export default theme;
