import { Router } from "express";
import { receiveSensorData } from "../controllers/dataController.js";
import { verifyDeviceKey } from "../middleware/deviceAuth.js";

const router = Router();

/**
 * Endpoint pentru hardware (Raspberry Pico, ESP32, etc.)
 * Exemplu apel: POST /data/RPI_PICO_001 sau POST /api/sensors/data
 * Header: x-api-key: <cheia din .env>
 * Body JSON: { "device_uid": "...", "temp": 23.5, "humidity": 60, "soil_moisture": 250 }
 */
router.post("/data", verifyDeviceKey, receiveSensorData);
router.post("/:device_uid", verifyDeviceKey, receiveSensorData);

export default router;
