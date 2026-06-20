// Display-only mapping for actuator names coming from the backend.
// The DB value stays unchanged — we only rename what the user sees.

const NAME_MAP = {
  electrovalva: "Pompă apă",
  "electrovalvă": "Pompă apă",
  pompa: "Pompă apă",
  "pompă": "Pompă apă",
};

export const displayActuatorName = (name) => {
  const key = (name || "").toLowerCase().trim();
  return NAME_MAP[key] || name;
};

// Pick a MaterialCommunityIcons glyph based on the raw actuator name.
export const actuatorIcon = (name) => {
  const k = (name || "").toLowerCase();
  if (k.includes("pomp") || k.includes("valv") || k.includes("apa") || k.includes("apă") || k.includes("irig"))
    return "water-pump";
  if (k.includes("vent") || k.includes("fan")) return "fan";
  if (k.includes("lumin") || k.includes("light") || k.includes("led")) return "lightbulb-on-outline";
  return "power";
};
