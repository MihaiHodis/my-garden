// Enhanced apiClient.js with better error handling and debugging

import axios from "axios";
import { auth } from "./firebase";
import { Platform } from "react-native";

// Configurable base URL for local development and production
// Replace '192.168.1.133' with your machine's local IP for physical device testing
const LOCAL_IP = "192.168.1.137"; 
const PORT = "5000";

// Use 10.0.2.2 for Android emulator, LOCAL_IP for physical devices/iOS
const DEV_URL = Platform.OS === 'android' && !Platform.isPad ? `http://10.0.2.2:${PORT}` : `http://${LOCAL_IP}:${PORT}`;

const BASE_URL = __DEV__ 
  ? DEV_URL
  : "https://your-new-server-domain.com";

// Mock user for development
export const MOCK_USER = {
  uid: "PTIIEpO4RMNgumt8Jnabe7Tsu2G3",
  getIdToken: async () => "mock-token-for-dev"
};


/**
 * Helper to get the current user, prioritizing mock user in development.
 */
export const getEffectiveUser = () => {
  return __DEV__ ? MOCK_USER : auth.currentUser;
};

// This is the base client for your server.
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 second timeout
});

// ▼▼▼ ADAUGĂ ACEST INTERCEPTOR PENTRU SECURITATE ▼▼▼
apiClient.interceptors.request.use(
  async (config) => {
    // În development, putem folosi un user mock dacă dorim să ignorăm Firebase
    const user = __DEV__ ? MOCK_USER : auth.currentUser;

    if (user) {
      try {
        // În development, returnăm un token fictiv dacă e mock user
        const token = await user.getIdToken();

        // Adaugă token-ul în header-ul de autorizare
        config.headers.Authorization = `Bearer ${token}`;

        if (__DEV__) {
          console.log("Using Development Auth (Mock or Firebase)");
        }
      } catch (error) {
        console.error("Could not get Auth token", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// ▲▲▲ SFÂRȘITUL INTERCEPTORULUI DE SECURITATE ▲▲▲

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log("API Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("Response Error:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

// =================================================================
// USER MANAGEMENT - ENHANCED WITH BETTER ERROR HANDLING
// =================================================================

// Get user data by ID
export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/users_data/${userId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

// Update user data - Enhanced version with multiple methods
export const updateUserById = async (userId, updatedData) => {
  try {
    console.log(`Attempting to update user ${userId} with:`, updatedData);

    // Method 1: Try PATCH first (partial update)
    try {
      const response = await apiClient.patch(
        `/users_data/${userId}`,
        updatedData
      );
      console.log("PATCH successful:", response.data);
      return response;
    } catch (patchError) {
      console.warn("PATCH failed, trying PUT:", patchError.message);

      // Method 2: If PATCH fails, try PUT (full update)
      // First get the current user data
      const currentUser = await getUserById(userId);
      const fullUserData = { ...currentUser.data, ...updatedData };

      const response = await apiClient.put(
        `/users_data/${userId}`,
        fullUserData
      );
      console.log("PUT successful:", response.data);
      return response;
    }
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);

    // Enhanced error handling
    if (error.response?.status === 404) {
      throw new Error(`User with ID ${userId} not found`);
    } else if (error.response?.status === 400) {
      throw new Error(
        `Invalid data provided: ${error.response.data?.message || "Bad request"
        }`
      );
    } else if (error.response?.status === 500) {
      throw new Error("Server error occurred while updating user");
    } else if (error.code === "ECONNREFUSED") {
      throw new Error("Cannot connect to server");
    } else {
      throw new Error(`Update failed: ${error.message}`);
    }
  }
};

// Alternative method using POST for updates (if your server requires it)
export const updateUserByIdViaPost = async (userId, updatedData) => {
  try {
    console.log(`POST update for user ${userId}:`, updatedData);
    const response = await apiClient.post(`/users_data/${userId}`, updatedData);
    return response;
  } catch (error) {
    console.error(`POST update error for user ${userId}:`, error);
    throw error;
  }
};

// Test connection function
export const testConnection = async () => {
  try {
    const response = await apiClient.get("/users_data");
    console.log("Connection test successful:", response.status);
    return true;
  } catch (error) {
    console.error("Connection test failed:", error);
    return false;
  }
};

// =================================================================
// CONTACT MANAGEMENT - ENHANCED
// =================================================================
export const submitContact = async (contactData) => {
  try {
    console.log("Submitting contact:", contactData);
    const response = await apiClient.post("/contacts", contactData);
    console.log("Contact submitted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Contact submission error:", error);
    if (error.response?.status === 400) {
      throw new Error(
        `Invalid contact data: ${error.response.data?.message || "Bad request"}`
      );
    }
    throw new Error("Failed to submit contact form");
  }
};

// =================================================================
// TASKS API CALLS - ENHANCED
// =================================================================

// Create a new task - Enhanced
export const createTask = async (taskData) => {
  try {
    console.log("Creating task:", taskData);
    const response = await apiClient.post("/tasks", taskData);
    console.log("Task created successfully:", response.data);
    return response;
  } catch (error) {
    console.error("Task creation error:", error);
    throw error;
  }
};

// Update an existing task - Enhanced
export const updateTask = async (taskId, updatedData) => {
  try {
    console.log(`Updating task ${taskId}:`, updatedData);

    // Try PATCH first
    try {
      const response = await apiClient.patch(`/tasks/${taskId}`, updatedData);
      return response;
    } catch (patchError) {
      console.warn("Task PATCH failed, trying PUT:", patchError.message);

      // If PATCH fails, try PUT with full data
      const currentTask = await apiClient.get(`/tasks/${taskId}`);
      const fullTaskData = { ...currentTask.data, ...updatedData };
      const response = await apiClient.put(`/tasks/${taskId}`, fullTaskData);
      return response;
    }
  } catch (error) {
    console.error(`Task update error for ${taskId}:`, error);
    throw error;
  }
};

/*=================================================================
      Adaugare functie logare prin firebase - gabi
  =================================================================
  
// =================================================================
// ALL OTHER EXISTING FUNCTIONS (unchanged)
// =================================================================

export const login = async (username, password) => {
  try {
    const response = await apiClient.get("/users");
    const user = response.data.find(
      (user) => user.name === username && user.password === password
    );
    if (user) {
      return user;
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    console.error("Login API Error:", error);
    throw new Error("Login failed");
  }
};
*/

// =================================================================
// REAL-TIME WEATHER (from external API)
// =================================================================
export const getRealtimeWeather = async (location) => {
  const apiKey = "MEFU4GCBW8YWKWKGE423V7K5Z";
  const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${apiKey}&contentType=json`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    const today = data.days[0];
    const nextDay = data.days[1];

    const current = data.currentConditions || today;

    // Helperi
    const getDayHourLabel = (datetimeString) => {
      const [hour, minute] = datetimeString.split(":");
      return `${hour}:${minute}`;
    };

    const getEmoji = (conditions) => {
      const t = conditions.toLowerCase();
      if (t.includes("clear")) return "☀️";
      if (t.includes("cloud")) return "☁️";
      if (t.includes("rain")) return "🌧️";
      if (t.includes("snow")) return "❄️";
      if (t.includes("storm") || t.includes("thunder")) return "⛈️";
      return "🌤️";
    };

    // Date curente
    const currentWeather = {
      location: data.resolvedAddress,
      weather_type: current.conditions,
      temperature: current.temp,
      humidity: current.humidity,
      wind: `${current.winddir}° ${current.windspeed} km/h`,
    };

    // Ora curentă și ora următoare
    const now = new Date();
    const nextHour = now.getMinutes() > 0 ? now.getHours() + 1 : now.getHours();

    // prognoza orară, combinând ore din „today.hours” și (dacă e nevoie) din „nextDay.hours”
    let hourlyForecast = [];

    if (today && Array.isArray(today.hours)) {
      // selectăm orele din azi de la nextHour încolo
      const hoursFromToday = today.hours.filter((h) => {
        const hourNum = parseInt(h.datetime.split(":")[0], 10);
        return hourNum >= nextHour;
      });

      // dacă nu sunt suficiente ore din azi, completăm cu ore din ziua următoare
      if (
        hoursFromToday.length < 12 &&
        nextDay &&
        Array.isArray(nextDay.hours)
      ) {
        const remaining = 12 - hoursFromToday.length;
        const hoursFromNextDay = nextDay.hours.slice(0, remaining);
        hourlyForecast = hoursFromToday.concat(hoursFromNextDay);
      } else {
        hourlyForecast = hoursFromToday.slice(0, 12);
      }

      hourlyForecast = hourlyForecast.map((hourData) => ({
        hour: getDayHourLabel(hourData.datetime),
        temp: hourData.temp,
        weather_type: hourData.conditions,
        emoji: getEmoji(hourData.conditions),
      }));
    }

    return {
      currentWeather,
      hourlyForecast,
    };
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    throw new Error("Could not fetch weather information.");
  }
};

// =================================================================
// Sensors & Actuators LOGIC DB
// =================================================================
export const getGreenhouses = () => apiClient.get("/greenhouses");

// Sensor and Actuator functions
export const getSensors = () => apiClient.get("/sensors");
export const getSensorsByGreenhouse = (greenhouseId) =>
  apiClient.get(`/sensors?greenhouse_id=${greenhouseId}`);

export const getActuators = () => apiClient.get("/actuators");
export const getActuatorsByGreenhouse = (greenhouseId) =>
  apiClient.get(`/actuators?greenhouse_id=${greenhouseId}`);

export const updateActuator = (id, updatedData) =>
  apiClient.put(`/actuators/${id}`, updatedData);

// =========================================
// ACTUATOR COMMANDS
// =========================================

export const sendActuatorCommand = async ({
  actuator_id,
  command,
  issued_by_user_id, // Firebase UID
  level,             // optional, doar pentru set_level
  expires_at,        // optional, JS Date
  duration_minutes,  // optional, doar pentru timer
}) => {
  if (!issued_by_user_id) {
    throw new Error("❌ Firebase UID undefined! Asigură-te că userul e autentificat.");
  }

  const payload = {
    actuator_id,
    command,
    issued_by_user_id,
  };

  // level e opțional
  if (level !== undefined && level !== null) payload.level = level;

  // expires_at se adaugă doar dacă e definit și nu e null
  if (expires_at !== undefined && expires_at !== null) {
    payload.expires_at = expires_at.toISOString().slice(0, 19).replace("T", " ");
  }

  // duration_minutes se adaugă doar pentru ON
  if (duration_minutes !== undefined && duration_minutes !== null) {
    payload.duration_minutes = duration_minutes;
  }

  console.log("📤 Trimit comanda actuator:", payload);

  try {
    const response = await apiClient.post("/actuators/commands", payload);
    console.log("✅ Comandă trimisă:", response.data);
    return response.data;
  } catch (err) {
    console.error("❌ Eroare la trimitere comandă:", err.response?.data || err.message);
    throw err;
  }
};

// Get commands by actuator
export const getCommandsByActuator = (actuatorId) =>
  apiClient.get(`/actuators/commands?actuator_id=${actuatorId}`);

// =================================================================
// ACTUATOR SCHEDULES API CALLS
// =================================================================

// Preia toate programările pentru o seră
export const getActuatorSchedulesByGreenhouse = (greenhouseId) =>
  apiClient.get(`/actuator_schedules?greenhouse_id=${greenhouseId}`);

// Adaugă o programare pentru actuator
export const createActuatorSchedule = async ({
  actuator_id,
  greenhouse_id,
  schedule_date,       // YYYY-MM-DD
  start_time,          // HH:mm
  end_time,            // HH:mm
  issued_by_user_id
}) => {
  if (!issued_by_user_id) {
    throw new Error("❌ Firebase UID undefined! Asigură-te că userul e autentificat.");
  }

  const payload = {
    actuator_id,
    greenhouse_id,
    schedule_date,
    start_time,
    end_time,
    issued_by_user_id,
  };

  console.log("📤 Creare programare actuator:", payload);

  try {
    const response = await apiClient.post("/actuator_schedules", payload);
    console.log("✅ Programare creată:", response.data);
    return response.data;
  } catch (err) {
    console.error("❌ Eroare la creare programare:", err.response?.data || err.message);
    throw err;
  }
};

// Șterge o programare după ID
export const deleteActuatorSchedule = async (scheduleId) => {
  try {
    const response = await apiClient.delete(`/actuator_schedules/${scheduleId}`);
    console.log("✅ Programare ștearsă:", response.data);
    return response.data;
  } catch (err) {
    console.error("❌ Eroare la ștergere programare:", err.response?.data || err.message);
    throw err;
  }
};



// =================================================================
// SENSOR & WEATHER READINGS API CALLS
// =================================================================
// Get all readings for a specific sensor
export const getReadingsBySensor = (sensorId, signal) =>
  apiClient.get(`/sensors_readings?sensor_id=${sensorId}`, { signal }); // 👈 Pass the signal to axios
export const getAllSensorReadings = () => apiClient.get("/sensors_readings");
export const getOutsideWeatherByGreenhouse = (greenhouseId) =>
  apiClient.get(`/outside_weather?greenhouse_id=${greenhouseId}`);
// =================================================================
// TASKS API CALLS
// =================================================================

// Fetch all tasks

export const getTasks = () =>
  apiClient.get("/tasks", {
    params: { t: Date.now() },
    headers: { "Cache-Control": "no-cache" },
  });

export const deleteTask = (taskId) => apiClient.delete(`/tasks/${taskId}`);
export const getAllUsersData = () => apiClient.get("/users_data");
export const createUserData = (userData) =>
  apiClient.post("/users_data", userData);
export const deleteUserById = (userId) =>
  apiClient.delete(`/users_data/${userId}`);

export const getContacts = async () => {
  try {
    const response = await apiClient.get("/contacts");
    return response.data;
  } catch (error) {
    console.error("Get contacts error:", error);
    throw new Error("Failed to fetch contacts");
  }
};

export const getContactById = async (id) => {
  try {
    const response = await apiClient.get(`/contacts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get contact error:", error);
    throw new Error("Failed to fetch contact");
  }
};

export const updateContactStatus = async (id, status) => {
  try {
    const response = await apiClient.patch(`/contacts/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error("Update contact status error:", error);
    throw new Error("Failed to update contact status");
  }
};

export const deleteContact = async (id) => {
  try {
    const response = await apiClient.delete(`/contacts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete contact error:", error);
    throw new Error("Failed to delete contact");
  }
};

export default apiClient;
