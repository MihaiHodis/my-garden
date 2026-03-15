import db from "../config/db.js";

/**
 * GET /sensors?greenhouse_id=123
 * Returnează toți senzorii din sera indicată, cu ultimele valori (dacă există).
 * Frontend-ul așteaptă câmpuri gen name/type/unit + poate folosi fallback
 * pentru technical_status și serial_number (le trimitem ca null).
 */
export const getSensorsByGreenhouse = async (req, res) => {
  const greenhouseId = Number(req.query.greenhouse_id);
  if (!Number.isFinite(greenhouseId)) {
    return res.status(400).json({ message: "Missing or invalid greenhouse_id" });
  }

  let conn;
  try {
    conn = await db.getConnection();

    // Ultima citire per senzor (după timestamp)
    const sql = `
      SELECT
        s.id,
        s.name,
        s.type,
        s.unit,
        s.technical_status,
        s.serial_number,
        c.id            AS controller_id,
        c.device_uid    AS controller_uid,
        gh.id           AS greenhouse_id,
        gh.name         AS greenhouse_name,
        lr.value        AS last_value,
        lr.timestamp    AS last_seen
      FROM sensors s
      JOIN controllers c    ON c.id = s.controller_id
      JOIN greenhouses gh   ON gh.id = c.greenhouse_id
      LEFT JOIN (
        SELECT sr.sensor_id, sr.value, sr.timestamp
        FROM sensor_readings sr
        JOIN (
          SELECT sensor_id, MAX(timestamp) AS max_ts
          FROM sensor_readings
          GROUP BY sensor_id
        ) t ON t.sensor_id = sr.sensor_id AND t.max_ts = sr.timestamp
      ) lr ON lr.sensor_id = s.id
      WHERE c.greenhouse_id = ?
      ORDER BY s.name;
    `;

    const [rows] = await conn.query(sql, [greenhouseId]);
    return res.json(rows);
  } catch (err) {
    console.error("getSensorsByGreenhouse error:", err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    if (conn) conn.release();
  }
};
