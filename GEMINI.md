# GEMINI.md - ByteStorm Smart Greenhouse

## Project Overview
**ByteStorm** is a complex IoT ecosystem designed for smart greenhouse automation and precision agriculture. The system integrates hardware monitoring, a secure backend, and a mobile application to provide real-time environmental control and data visualization.

### Architecture & Components
1.  **Hardware (IoT Device):**
    *   **Core:** Raspberry Pi Pico 2 W running MicroPython.
    *   **Sensors:** DHT22 (Temperature & Humidity via I2C), Soil Moisture Sensor (Analog ADC).
    *   **Actuators:** Relays controlling a Pump (irrigation) and Fan (ventilation).
    *   **Logic:** Asynchronous control loop with automatic threshold-based actions and manual backend overrides.
2.  **Backend (API Server):**
    *   **Tech Stack:** Node.js (Express 5), MySQL/MariaDB.
    *   **Authentication:** Firebase Auth for mobile users; API-key for IoT devices.
    *   **Role:** Bridges hardware telemetry with user controls and persists historical data.
3.  **Frontend (Mobile App):**
    *   **Tech Stack:** React Native (Expo), Victory Native (Charts).
    *   **Role:** User interface for monitoring greenhouse conditions, viewing statistics, and manually overriding actuators.
4.  **Cloud Infrastructure:**
    *   **Hosting:** VPS (AlmaLinux) running Apache, MySQL, and Node.js.
    *   **Security:** SSL/TLS via Let's Encrypt (Certbot).

---

## Building and Running

### Backend
1.  **Navigate:** `cd backend`
2.  **Install:** `npm install`
3.  **Environment:** 
    *   Create `.env` based on `Readme_backend.md`.
    *   Place Firebase `serviceAccountKey.json` in `backend/config/`.
4.  **Database:** Initialize MySQL using `backend/DATABASE_SETUP.md`.
5.  **Run:** `npm run dev` (Starts server on port 5000).

### Frontend (React Native)
1.  **Navigate:** `cd frontend/react-native`
2.  **Install:** `npm install`
3.  **Run:** `npx expo start`
4.  **Build:** `npm run build` (uses EAS).

### Hardware (Pico)
1.  **Files:** Copy contents of `hardware/_pico/` to the Raspberry Pi Pico.
2.  **Configuration:** Rename `data_transfer/sample_secrets.py` to `secrets.py` and fill in Wi-Fi and API credentials.
3.  **Execution:** `main.py` is the entry point.

---

## Development Conventions

### General
*   **Modularity:** Keep hardware, backend, and frontend logic strictly decoupled.
*   **Security:** Never commit `.env`, `secrets.py`, or `serviceAccountKey.json`.
*   **Documentation:** Maintain READMEs in each sub-directory for component-specific details.

### Backend (Node.js)
*   **Pattern:** Use Controller-Route-Service pattern.
*   **SQL:** Use prepared statements (`mysql2/promise`) to prevent injection.
*   **Auth:** Every user request must be verified via `authMiddleware` (Firebase ID Token).

### Frontend (React Native)
*   **Styling:** Follow the established theme in `components/GlobalStyles`.
*   **API:** Use the `apiClient.js` service for all backend communication.

### Hardware (MicroPython)
*   **Concurrency:** Use `uasyncio` for non-blocking sensor reads and network polling.
*   **Safety:** Always implement an `OVERRIDE_TIMEOUT` for manual commands to ensure the system returns to autonomous "safe" mode.
*   **Feedback:** Use the on-board LED patterns (defined in `status_led.py`) for headless debugging.

---

## Key Files & Directories
*   `backend/server.js`: API Entry point.
*   `frontend/react-native/App.js`: Mobile app root.
*   `hardware/_pico/main.py`: IoT orchestration logic.
*   `antreprenoriat/`: Business planning and documentation.
*   `cloud/docs/Configurari.md`: Server setup steps.
