import { Router } from "express";
import { getDeviceCommands, toggleActuator } from "../controllers/deviceController.js";
import { verifyDeviceKey } from "../middleware/deviceAuth.js";

const router = Router();

// GET comenzi actuatoare pentru Pico/ESP32
router.get("/api/data/:device_uid/commands", verifyDeviceKey, getDeviceCommands);

// New aliases for ESP32
router.get("/status", verifyDeviceKey, getDeviceCommands);
router.get("/status/:device_uid", verifyDeviceKey, getDeviceCommands);
router.post("/toggle", verifyDeviceKey, toggleActuator);

export default router;
