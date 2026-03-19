-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gazdă: 127.0.0.1
-- Timp de generare: mart. 19, 2026 la 06:12 PM
-- Versiune server: 10.4.32-MariaDB
-- Versiune PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Bază de date: `bytestorm`
--

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `actuators`
--

CREATE TABLE `actuators` (
  `id` bigint(20) NOT NULL,
  `controller_id` bigint(20) DEFAULT NULL,
  `type` enum('pump','fan','light') DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `serial_number` varchar(100) DEFAULT NULL,
  `technical_status` enum('ok','error') DEFAULT NULL,
  `status` enum('on','off') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Eliminarea datelor din tabel `actuators`
--

INSERT INTO `actuators` (`id`, `controller_id`, `type`, `name`, `is_active`, `serial_number`, `technical_status`, `status`, `created_at`) VALUES
(1, 1, NULL, 'Electrovalva', 1, 'No_num', 'ok', 'off', '2026-03-19 16:50:46');

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `actuator_commands`
--

CREATE TABLE `actuator_commands` (
  `id` bigint(20) NOT NULL,
  `actuator_id` bigint(20) DEFAULT NULL,
  `command` enum('on','off') DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `issued_by_user_id` varchar(128) DEFAULT NULL,
  `issued_at` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Eliminarea datelor din tabel `actuator_commands`
--

INSERT INTO `actuator_commands` (`id`, `actuator_id`, `command`, `level`, `issued_by_user_id`, `issued_at`, `expires_at`) VALUES
(1, 1, 'on', NULL, 'PTIIEpO4RMNgumt8Jnabe7Tsu2G3', '2026-03-19 18:51:24', '2026-03-19 18:56:24'),
(2, 1, 'off', NULL, 'system_cron', '2026-03-19 18:57:23', NULL);

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `actuator_schedules`
--

CREATE TABLE `actuator_schedules` (
  `id` bigint(20) NOT NULL,
  `actuator_id` bigint(20) DEFAULT NULL,
  `greenhouse_id` bigint(20) DEFAULT NULL,
  `schedule_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `issued_by_user_id` varchar(128) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `contacts`
--

CREATE TABLE `contacts` (
  `id` bigint(20) NOT NULL,
  `owner_user_id` varchar(128) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `source` varchar(50) DEFAULT NULL,
  `moduleCategory` varchar(100) DEFAULT NULL,
  `priority` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `controllers`
--

CREATE TABLE `controllers` (
  `id` bigint(20) NOT NULL,
  `device_uid` varchar(64) DEFAULT NULL,
  `label` varchar(128) DEFAULT NULL,
  `location` varchar(128) DEFAULT NULL,
  `greenhouse_id` bigint(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Eliminarea datelor din tabel `controllers`
--

INSERT INTO `controllers` (`id`, `device_uid`, `label`, `location`, `greenhouse_id`, `created_at`) VALUES
(1, 'esp32_garden_1', 'Garden ESP32', 'Backyard', 2, '2026-03-14 14:42:39');

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `greenhouses`
--

CREATE TABLE `greenhouses` (
  `id` bigint(20) NOT NULL,
  `name` varchar(128) DEFAULT NULL,
  `owner_user_id` varchar(128) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Eliminarea datelor din tabel `greenhouses`
--

INSERT INTO `greenhouses` (`id`, `name`, `owner_user_id`, `location`, `created_at`) VALUES
(2, 'My Garden', 'PTIIEpO4RMNgumt8Jnabe7Tsu2G3', 'Home', '2026-03-12 17:12:15');

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `outside_weather`
--

CREATE TABLE `outside_weather` (
  `id` int(11) NOT NULL,
  `greenhouse_id` bigint(20) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `temperature` decimal(5,2) DEFAULT NULL,
  `humidity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `sensors`
--

CREATE TABLE `sensors` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `controller_id` bigint(20) DEFAULT NULL,
  `type` enum('temperature','humidity','soil','light') DEFAULT NULL,
  `unit` varchar(32) DEFAULT NULL,
  `serial_number` varchar(100) DEFAULT NULL,
  `technical_status` enum('ok','error') DEFAULT NULL,
  `status` enum('on','off') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Eliminarea datelor din tabel `sensors`
--

INSERT INTO `sensors` (`id`, `name`, `controller_id`, `type`, `unit`, `serial_number`, `technical_status`, `status`, `created_at`) VALUES
(1, 'Soil Moisture Sensor', 1, 'soil', '%', NULL, 'ok', 'on', '2026-03-14 14:43:07');

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `sensor_readings`
--

CREATE TABLE `sensor_readings` (
  `id` bigint(20) NOT NULL,
  `sensor_id` bigint(20) DEFAULT NULL,
  `value` decimal(10,4) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Eliminarea datelor din tabel `sensor_readings`
--

INSERT INTO `sensor_readings` (`id`, `sensor_id`, `value`, `timestamp`) VALUES
(1, 1, 42.5000, '2026-03-14 16:43:26'),
(2, 1, 29.0000, '2026-03-14 18:33:58'),
(3, 1, 28.1667, '2026-03-14 18:35:58'),
(4, 1, 28.8333, '2026-03-14 18:52:38'),
(5, 1, 29.1667, '2026-03-14 18:53:47'),
(6, 1, 29.0000, '2026-03-14 18:57:38'),
(7, 1, 29.0000, '2026-03-14 18:58:38'),
(8, 1, 29.6667, '2026-03-14 18:59:38'),
(9, 1, 29.1667, '2026-03-14 19:00:38'),
(10, 1, 29.0000, '2026-03-14 19:01:38'),
(11, 1, 27.8333, '2026-03-14 19:21:38'),
(12, 1, 29.0000, '2026-03-14 19:26:54'),
(13, 1, 29.3333, '2026-03-14 19:28:14'),
(14, 1, 29.1667, '2026-03-14 19:28:54'),
(15, 1, 29.0000, '2026-03-14 19:41:57'),
(16, 1, 29.1667, '2026-03-14 19:42:57'),
(17, 1, 28.3333, '2026-03-14 19:46:08'),
(18, 1, 29.0000, '2026-03-14 19:48:05'),
(19, 1, 28.5000, '2026-03-14 19:49:05'),
(20, 1, 28.6667, '2026-03-14 19:50:06'),
(21, 1, 29.0000, '2026-03-14 19:51:05'),
(22, 1, 40.1667, '2026-03-14 19:52:05'),
(23, 1, 28.3333, '2026-03-14 19:53:05');

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `users_data`
--

CREATE TABLE `users_data` (
  `id` bigint(20) NOT NULL,
  `nickname` varchar(50) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `firebase_uid` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Eliminarea datelor din tabel `users_data`
--

INSERT INTO `users_data` (`id`, `nickname`, `avatar`, `firebase_uid`) VALUES
(1, 'mihai', 'avatar_2.png', 'PTIIEpO4RMNgumt8Jnabe7Tsu2G3');

--
-- Indexuri pentru tabele eliminate
--

--
-- Indexuri pentru tabele `actuators`
--
ALTER TABLE `actuators`
  ADD PRIMARY KEY (`id`),
  ADD KEY `controller_id` (`controller_id`);

--
-- Indexuri pentru tabele `actuator_commands`
--
ALTER TABLE `actuator_commands`
  ADD PRIMARY KEY (`id`),
  ADD KEY `actuator_id` (`actuator_id`);

--
-- Indexuri pentru tabele `actuator_schedules`
--
ALTER TABLE `actuator_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `actuator_id` (`actuator_id`),
  ADD KEY `greenhouse_id` (`greenhouse_id`);

--
-- Indexuri pentru tabele `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexuri pentru tabele `controllers`
--
ALTER TABLE `controllers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `greenhouse_id` (`greenhouse_id`);

--
-- Indexuri pentru tabele `greenhouses`
--
ALTER TABLE `greenhouses`
  ADD PRIMARY KEY (`id`);

--
-- Indexuri pentru tabele `outside_weather`
--
ALTER TABLE `outside_weather`
  ADD PRIMARY KEY (`id`),
  ADD KEY `greenhouse_id` (`greenhouse_id`);

--
-- Indexuri pentru tabele `sensors`
--
ALTER TABLE `sensors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `controller_id` (`controller_id`);

--
-- Indexuri pentru tabele `sensor_readings`
--
ALTER TABLE `sensor_readings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sensor_id` (`sensor_id`);

--
-- Indexuri pentru tabele `users_data`
--
ALTER TABLE `users_data`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `firebase_uid` (`firebase_uid`);

--
-- AUTO_INCREMENT pentru tabele eliminate
--

--
-- AUTO_INCREMENT pentru tabele `actuators`
--
ALTER TABLE `actuators`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pentru tabele `actuator_commands`
--
ALTER TABLE `actuator_commands`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pentru tabele `actuator_schedules`
--
ALTER TABLE `actuator_schedules`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pentru tabele `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pentru tabele `controllers`
--
ALTER TABLE `controllers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pentru tabele `greenhouses`
--
ALTER TABLE `greenhouses`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pentru tabele `outside_weather`
--
ALTER TABLE `outside_weather`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pentru tabele `sensors`
--
ALTER TABLE `sensors`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pentru tabele `sensor_readings`
--
ALTER TABLE `sensor_readings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT pentru tabele `users_data`
--
ALTER TABLE `users_data`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constrângeri pentru tabele eliminate
--

--
-- Constrângeri pentru tabele `actuators`
--
ALTER TABLE `actuators`
  ADD CONSTRAINT `actuators_ibfk_1` FOREIGN KEY (`controller_id`) REFERENCES `controllers` (`id`);

--
-- Constrângeri pentru tabele `actuator_commands`
--
ALTER TABLE `actuator_commands`
  ADD CONSTRAINT `actuator_commands_ibfk_1` FOREIGN KEY (`actuator_id`) REFERENCES `actuators` (`id`);

--
-- Constrângeri pentru tabele `actuator_schedules`
--
ALTER TABLE `actuator_schedules`
  ADD CONSTRAINT `actuator_schedules_ibfk_1` FOREIGN KEY (`actuator_id`) REFERENCES `actuators` (`id`),
  ADD CONSTRAINT `actuator_schedules_ibfk_2` FOREIGN KEY (`greenhouse_id`) REFERENCES `greenhouses` (`id`);

--
-- Constrângeri pentru tabele `controllers`
--
ALTER TABLE `controllers`
  ADD CONSTRAINT `controllers_ibfk_1` FOREIGN KEY (`greenhouse_id`) REFERENCES `greenhouses` (`id`);

--
-- Constrângeri pentru tabele `outside_weather`
--
ALTER TABLE `outside_weather`
  ADD CONSTRAINT `outside_weather_ibfk_1` FOREIGN KEY (`greenhouse_id`) REFERENCES `greenhouses` (`id`);

--
-- Constrângeri pentru tabele `sensors`
--
ALTER TABLE `sensors`
  ADD CONSTRAINT `sensors_ibfk_1` FOREIGN KEY (`controller_id`) REFERENCES `controllers` (`id`);

--
-- Constrângeri pentru tabele `sensor_readings`
--
ALTER TABLE `sensor_readings`
  ADD CONSTRAINT `sensor_readings_ibfk_1` FOREIGN KEY (`sensor_id`) REFERENCES `sensors` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
