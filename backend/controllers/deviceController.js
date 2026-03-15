import pool from "../config/db.js";

// returnează ultimele comenzi pentru actuatoare sub forma { pump: bool, fan: bool }
export async function getDeviceCommands(req, res) {
  try {
    const device_uid = req.params.device_uid || req.query.device_uid || req.body.device_uid;

    if (!device_uid) {
      return res.status(400).json({ error: "device_uid is required" });
    }

    // Verificăm controller-ul după device_uid
    const [ctrl] = await pool.query(
      "SELECT id FROM controllers WHERE device_uid = ? LIMIT 1",
      [device_uid]
    );
    if (ctrl.length === 0) {
      return res.status(404).json({ error: "Controller not found" });
    }
    const controllerId = ctrl[0].id;

    // Luăm actuatoarele asociate controllerului
    const [rows] = await pool.query(
      `SELECT a.type, a.status 
       FROM actuators a
       WHERE a.controller_id = ?`,
      [controllerId]
    );

    // Transformăm în răspuns { pump: bool, fan: bool, light: bool }
    const response = {};
    for (const r of rows) {
      if (r.type === "pump") response.pump = r.status === "on";
      if (r.type === "fan") response.fan = r.status === "on";
      if (r.type === "light") response.light = r.status === "on";
    }

    res.json(response);
  } catch (err) {
    console.error("getDeviceCommands error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// Nou: permite toggle pentru actuatoare de la device-uri (ESP32)
export async function toggleActuator(req, res) {
  try {
    const { device_uid, type, status } = req.body;

    if (!device_uid || !type || status === undefined) {
      return res.status(400).json({ error: "Missing device_uid, type or status" });
    }

    // 1) Găsim controllerul
    const [ctrl] = await pool.query(
      "SELECT id FROM controllers WHERE device_uid = ? LIMIT 1",
      [device_uid]
    );
    if (ctrl.length === 0) {
      return res.status(404).json({ error: "Controller not found" });
    }
    const controllerId = ctrl[0].id;

    // 2) Update status actuator
    const newStatus = status ? "on" : "off";
    const [result] = await pool.query(
      "UPDATE actuators SET status = ? WHERE controller_id = ? AND type = ?",
      [newStatus, controllerId, type]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Actuator not found for this device" });
    }

    res.json({ success: true, type, status: newStatus });
  } catch (err) {
    console.error("toggleActuator error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
