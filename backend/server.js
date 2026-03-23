import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import "./services/scheduler.js";
import dataRoutes from "./routes/dataRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import greenhouseRoutes from "./routes/greenhouseRoutes.js";
import sensorsRoutes from "./routes/sensorsRoutes.js";
import getSensorsByGreenhouse from "./routes/sensorsByGreenhouseRoutes.js";
import actuatorsRoutes from "./routes/actuatorsRoutes.js";
import sensorReadingsRoutes from "./routes/sensorReadingsRoutes.js";
import outsideWeatherRoutes from "./routes/outsideWeatherRoutes.js";
import usersDataRoutes from "./routes/usersDataRoutes.js";
import contactsRoutes from "./routes/contactsRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import actuatorSchedulesRoutes from "./routes/actuatorSchedulesRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "*", // For development, allow all origins. For production, specify origins.
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key"]
}));
app.use(express.json());

// Routes
app.use("/api/data", dataRoutes); // existing: POST /api/data/:device_uid
app.use("/api/sensors", dataRoutes); // new alias as requested: POST /api/sensors/data
app.use("/users", usersRoutes);
app.use("/greenhouses", greenhouseRoutes);
app.use("/sensors", sensorsRoutes);
app.use("/sensors", getSensorsByGreenhouse);
app.use("/actuators", actuatorsRoutes);
app.use("/sensors_readings", sensorReadingsRoutes);
app.use("/outside_weather", outsideWeatherRoutes);
app.use("/users_data", usersDataRoutes);
app.use("/contacts", contactsRoutes);
app.use("/", deviceRoutes); // existing: GET /api/data/:device_uid/commands
app.use("/api/actuators", deviceRoutes); // new alias for toggle/status
app.use("/actuator_schedules", actuatorSchedulesRoutes);


// Server start
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${BASE_URL}`);
  console.log(`Accessible locally at http://localhost:${PORT}`);
});
