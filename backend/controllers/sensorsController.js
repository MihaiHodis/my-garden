import pool from "../config/db.js";

export async function listSensors(req, res) {
  const gid = req.query.greenhouse_id ? Number(req.query.greenhouse_id) : null;

  try {
    const userUid = req.user.uid; // UID din token

    let whereClause = "WHERE g.owner_user_id = ?";
    let params = [userUid];

    // --- BYPASS PENTRU DEZVOLTARE LOCALĂ ---
    if (process.env.NODE_ENV === "development") {
      whereClause = "WHERE 1=1";
      params = [];
    }
    // ----------------------------------------

    const baseSelect = `
      SELECT
        s.id,
        s.name,
        s.type,
        s.unit,
        s.serial_number,
        s.technical_status,
        c.greenhouse_id
      FROM sensors s
      JOIN controllers c ON c.id = s.controller_id
      JOIN greenhouses g ON g.id = c.greenhouse_id
      ${whereClause}
    `;

    const sql = gid
      ? `${baseSelect} AND c.greenhouse_id = ? ORDER BY s.id ASC`
      : `${baseSelect} ORDER BY s.id ASC`;

    if (gid) params.push(gid);
    const [rows] = await pool.query(sql, params);

    // 🔑 Formatăm răspunsul exact cum cere frontend-ul
    const sensors = rows.map((sensor) => ({
      id: sensor.id,
      name: sensor.name,
      greenhouse_id: sensor.greenhouse_id,
      type: sensor.type,
      unit: sensor.unit || "", // trimitem și unit
      status: "off", // fallback temporar
      serial_number: sensor.serial_number || "nespecificat",
      technical_status: sensor.technical_status,
    }));

    res.json(sensors);
  } catch (err) {
    console.error("listSensors error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
