-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 22 Jan 2025 pada 20.46
-- Versi server: 10.6.19-MariaDB-log
-- Versi PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `probmaxc_pmc1`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `appointment`
--

CREATE TABLE `appointment` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `location` varchar(255) NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `username` varchar(255) DEFAULT NULL,
  `whatsapp_number` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `appointment`
--

INSERT INTO `appointment` (`id`, `user_id`, `location`, `appointment_date`, `appointment_time`, `created_at`, `username`, `whatsapp_number`) VALUES
(15, 31, 'Bento Kopi Tajem', '2024-05-21', '21:00:00', '2024-12-24 15:23:37', 'Boni', '089528499800'),
(16, 43, 'Terace', '2024-12-26', '02:36:00', '2024-12-25 19:36:50', 'pou', '888008800088'),
(17, 31, '', '2025-01-21', '21:00:00', '2025-01-05 10:42:51', 'Boni', '0219019292'),
(18, 31, '', '2025-01-21', '02:00:00', '2025-01-05 10:45:04', 'Boni', '0281829383892'),
(19, 31, '', '2025-02-12', '09:00:00', '2025-01-05 10:47:25', 'Boni', '12891829182'),
(20, 31, '', '2025-02-12', '01:00:00', '2025-01-05 10:57:25', 'Boni', '089528499800'),
(21, 31, '', '2025-02-21', '01:00:00', '2025-01-05 10:58:37', 'Boni', '082197697063'),
(22, 31, '', '2025-01-12', '09:00:00', '2025-01-05 10:59:19', 'Boni', '0891281828'),
(23, 59, '', '2025-01-20', '09:44:00', '2025-01-20 02:44:32', 'Mirco ganteng', '081347756819'),
(24, 61, '', '2025-01-22', '01:08:00', '2025-01-21 17:09:06', 'lang', '0895326055775');

-- --------------------------------------------------------

--
-- Struktur dari tabel `consultant_schedule`
--

CREATE TABLE `consultant_schedule` (
  `id` int(11) NOT NULL,
  `consultant_id` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `daily_feedback`
--

CREATE TABLE `daily_feedback` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `total_score` int(11) NOT NULL,
  `stress_level` varchar(20) NOT NULL,
  `color` varchar(20) NOT NULL,
  `answers_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`answers_json`)),
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `daily_feedback`
--

INSERT INTO `daily_feedback` (`id`, `user_id`, `username`, `total_score`, `stress_level`, `color`, `answers_json`, `created_at`) VALUES
(1, 31, 'Boni', 11, 'Mengalami Tekanan', 'orange', '{\"question_1\":1,\"question_2\":1,\"question_3\":2,\"question_4\":2,\"question_5\":1,\"question_6\":0,\"question_7\":1,\"question_8\":1,\"question_9\":1,\"question_10\":1}', '2024-12-24 22:36:48'),
(2, 31, 'Boni', 11, 'Mengalami Tekanan', 'orange', '{\"question_1\":1,\"question_2\":1,\"question_3\":2,\"question_4\":2,\"question_5\":1,\"question_6\":0,\"question_7\":1,\"question_8\":1,\"question_9\":1,\"question_10\":1}', '2024-12-24 22:36:49'),
(3, 35, 'Lodido', 21, 'Cukup Baik, Butuh Pe', 'yellow', '{\"question_1\":2,\"question_2\":3,\"question_3\":3,\"question_4\":2,\"question_5\":2,\"question_6\":2,\"question_7\":2,\"question_8\":1,\"question_9\":2,\"question_10\":2}', '2024-12-24 23:34:40'),
(4, 41, 'Ketut Frelly', 15, 'Cukup Baik, Butuh Pe', 'yellow', '{\"question_1\":0,\"question_2\":3,\"question_3\":1,\"question_4\":3,\"question_5\":0,\"question_6\":3,\"question_7\":3,\"question_8\":0,\"question_9\":1,\"question_10\":1}', '2024-12-25 21:32:49'),
(5, 39, 'Mikel20', 16, 'Cukup Baik, Butuh Pe', 'yellow', '{\"question_1\":3,\"question_2\":1,\"question_3\":2,\"question_4\":1,\"question_5\":1,\"question_6\":2,\"question_7\":1,\"question_8\":3,\"question_9\":1,\"question_10\":1}', '2024-12-25 21:35:25'),
(6, 43, 'pou', 7, 'Mengalami Tekanan', 'orange', '{\"question_1\":0,\"question_2\":1,\"question_3\":3,\"question_4\":0,\"question_5\":1,\"question_6\":1,\"question_7\":1,\"question_8\":0,\"question_9\":0,\"question_10\":0}', '2024-12-26 02:34:44'),
(7, 45, 'Komang ayu', 21, 'Cukup Baik, Butuh Pe', 'yellow', '{\"question_1\":3,\"question_2\":3,\"question_3\":2,\"question_4\":1,\"question_5\":1,\"question_6\":2,\"question_7\":3,\"question_8\":3,\"question_9\":1,\"question_10\":2}', '2024-12-26 12:02:20'),
(8, 47, 'Leni sartikal', 21, 'Cukup Baik, Butuh Pe', 'yellow', '{\"question_1\":1,\"question_2\":3,\"question_3\":2,\"question_4\":1,\"question_5\":2,\"question_6\":3,\"question_7\":3,\"question_8\":3,\"question_9\":1,\"question_10\":2}', '2024-12-26 15:39:26'),
(9, 56, 'my.secrettt', 15, 'Cukup Baik, Butuh Pe', 'yellow', '{\"question_1\":1,\"question_2\":2,\"question_3\":2,\"question_4\":1,\"question_5\":1,\"question_6\":1,\"question_7\":1,\"question_8\":3,\"question_9\":2,\"question_10\":1}', '2025-01-04 21:55:12'),
(10, 39, 'Mikel20', 15, 'Cukup Baik, Butuh Pe', 'yellow', '{\"question_1\":2,\"question_2\":0,\"question_3\":2,\"question_4\":1,\"question_5\":1,\"question_6\":2,\"question_7\":1,\"question_8\":3,\"question_9\":2,\"question_10\":1}', '2025-01-14 19:37:19'),
(11, 59, 'Mirco ganteng', 13, 'Mengalami Tekanan', 'orange', '{\"question_1\":3,\"question_2\":1,\"question_3\":3,\"question_4\":0,\"question_5\":3,\"question_6\":0,\"question_7\":0,\"question_8\":0,\"question_9\":3,\"question_10\":0}', '2025-01-20 09:43:47'),
(12, 31, 'Boni', 14, 'Mengalami Tekanan', 'orange', '{\"question_1\":2,\"question_2\":2,\"question_3\":0,\"question_4\":3,\"question_5\":0,\"question_6\":2,\"question_7\":1,\"question_8\":2,\"question_9\":1,\"question_10\":1}', '2025-01-20 10:04:35'),
(13, 60, 'gatax', 10, 'Mengalami Tekanan', 'orange', '{\"question_1\":0,\"question_2\":1,\"question_3\":0,\"question_4\":3,\"question_5\":1,\"question_6\":1,\"question_7\":0,\"question_8\":1,\"question_9\":3,\"question_10\":0}', '2025-01-22 00:05:18'),
(14, 61, 'lang', 22, 'Cukup Baik, Butuh Pe', 'yellow', '{\"question_1\":3,\"question_2\":0,\"question_3\":0,\"question_4\":1,\"question_5\":3,\"question_6\":3,\"question_7\":3,\"question_8\":3,\"question_9\":3,\"question_10\":3}', '2025-01-22 00:08:14'),
(15, 41, 'Ketut Frelly', 17, 'Cukup Baik, Butuh Pe', 'yellow', '{\"question_1\":2,\"question_2\":3,\"question_3\":1,\"question_4\":0,\"question_5\":1,\"question_6\":2,\"question_7\":3,\"question_8\":2,\"question_9\":1,\"question_10\":2}', '2025-01-22 14:04:38');

-- --------------------------------------------------------

--
-- Struktur dari tabel `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'Admin'),
(2, 'Consultant'),
(3, 'User');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role_id` int(11) NOT NULL,
  `reset_token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`, `role_id`, `reset_token`) VALUES
(31, 'Boni', 'boni123@gmail.com', '$2y$10$SDeo.sY9A7pBfjhC2fIPMeivooAd2RkC1x.gXQHT8dYHFX1hnnAim', '2024-12-24 15:12:14', 3, NULL),
(32, 'Boni12', 'boni12@gmail.com', '$2y$10$Vckxz4dxHPwnvHKBtgZROeyNoYQJDfCyY9IN2.QiTM.UyoGkUKCt6', '2024-12-24 15:20:43', 2, NULL),
(33, 'Mikel', 'michaelchristianmc7@gmail.com', '$2y$10$yko40khODOOay3HMdiN7Ie2crAygFv5NiRbQsBXkUmLkoE01vwIUq', '2024-12-24 15:38:04', 2, NULL),
(34, 'cici', 'rikomaking2@gmail.com', '$2y$10$fNt862U9yAmkRt7gCXrTU.RfscBdXeZVSWqkxOhOzp6HFjRzjguua', '2024-12-24 16:20:17', 3, NULL),
(35, 'Lodido', 'lodido12@gmail.com', '$2y$10$qWc.B1Yy/HcWIEURo7pKw.hIRO5/Hwc/V.8D6nV96Yp9SP2dBpMGK', '2024-12-24 16:31:51', 3, NULL),
(37, 'aulina', 'nuraulinaimani@gmail.com', '$2y$10$DSCpzqY0JuirLx.M9evS8evxG2lESj.Y2ZtPlCLNNtWlwPdGj1Ml.', '2024-12-24 17:28:32', 3, NULL),
(39, 'Mikel20', 'christianmichael37682@gmail.com', '$2y$10$H8a/1nRDsUfVyaq8isw/VeUMjbzrX4hUXl5CxZsxkOnoCMfoCzPAG', '2024-12-25 01:17:09', 3, NULL),
(40, 'I KETUT FRELLY ARYA SAPUTRA', 'ketutfrellyp@gmail.com', '$2y$10$q5kY3fAXXuHinYuPXOwtUOkoJiF.Ne1D1bOWxlUQoDqxHGfMPm9Ka', '2024-12-25 06:34:28', 2, NULL),
(41, 'Ketut Frelly', 'isaputra341@sma.belajar.id', '$2y$10$Bba5RUzok0/jnKpgYesKaeFlmF3u065rVl08OXvXrWXG60b6ESnqq', '2024-12-25 14:24:52', 3, NULL),
(42, 'Mariana Pira', 'marianapira01@gmail.com', '$2y$10$qq2qVoEt.Bo5ltNEl0LnJuImKuoKUT1c4v4c8PCGE8j950nAaqxtm', '2024-12-25 17:30:33', 3, NULL),
(43, 'pou', 'paulinatriya20@gmail.com', '$2y$10$dx54Z0qvKI7w3zgJJg7qiO25e1y1K4J7gUmCg3ILWk8ahKhMqQth6', '2024-12-25 19:31:19', 3, NULL),
(44, 'crusitha tara', 'crusithatripermatarani@gmail.com', '$2y$10$sBgWWwSc4dBW4Jt5FSWMpuZ0pwAKblKoCHKIXe.QOZgoN0E321FOK', '2024-12-25 22:48:27', 3, NULL),
(45, 'Komang ayu', 'mang48125@gmail.com', '$2y$10$t59Vji9a1NmvO1LpvtteEO8r.xiFkzEXse5G5q5LrPGam3DUPT7ru', '2024-12-26 04:57:10', 3, NULL),
(46, 'bakpao', 'triapaulina20@gmail.com', '$2y$10$XG38Lu30pyeCUkDgPBU6vOLUKO/K2ZHPPmUtfCBikC.bprSeWvYK2', '2024-12-26 08:31:07', 3, NULL),
(47, 'Leni sartikal', 'lenisartikal922@gmail.com', '$2y$10$KsbhbrAYDrrCFbHUDO/fG.2lZNgmQZ3MSRzF8iVXFX3UnPAEDrImq', '2024-12-26 08:33:34', 3, NULL),
(48, 'emel', 'emeliana.bky2018@gmaol.com', '$2y$10$aphrpAQPL52hi.MIceNviuC.ur0adgcJeBmPbcGeTr1utqNhSFN3O', '2024-12-26 08:45:22', 3, NULL),
(49, 'emelia', 'emeliana.bky2017@gmail.com', '$2y$10$tyIt7J79EIAZ2C/g6gLBc.lhQVVAyq8g1BkrsxNDyEcxGepw.IIa.', '2024-12-26 08:46:44', 3, NULL),
(50, 'Lelycomel', 'sitiagustin102723@gmail.com', '$2y$10$N/FVEB.2Ow5lGrMjOCAaIO1z5icEHSXobB6.ZckxiBhdOAhn0jotC', '2024-12-26 12:37:23', 3, NULL),
(53, 'Aldi ersya 73', 'aldiyakusa3@gmail.com', '$2y$10$zfFj6W8wn76WzkomBgHEgukyHryGhgGsSWw.kZVMw4CyBltgFnXQu', '2024-12-28 18:03:31', 3, NULL),
(55, 'POenyy', 'Boniii@gmail.com', '$2y$10$HmqiqpuwSc5zsIm79UbA6.877HwYiObj8nrNOHj/jaRo8p5lsvwdS', '2025-01-04 14:28:00', 3, NULL),
(56, 'my.secrettt', 'smarttv@gmail.com', '$2y$10$nGTB9v4LmzT.m89Px11z9ew7lRc0DzyMGwBISLOS4Ar.tltND7T/G', '2025-01-04 14:40:12', 3, NULL),
(57, 'Valdo', 'fernandesosvaldo351@gmail.com', '$2y$10$Vp5QbU60rU/YbfTx20oW3eH6608SMGjCjaavhx8u7s9OC2Y9vlF4a', '2025-01-08 13:28:16', 3, NULL),
(58, 'alyya', 'cnuralyya@gmail.com', '$2y$10$7xoGsOqQ7.6H.5C6KubmxOnPZPrUsgbsepV8IULM7lsUtENzFYIsO', '2025-01-16 05:30:44', 3, NULL),
(59, 'Mirco ganteng', 'mircoroberto7@gmail.com', '$2y$10$EujPMCU/vdJdsA7T1L.XFeHrbnnWHCtWsGM5x2wwHxmuWNrMlC9gu', '2025-01-20 02:42:26', 3, NULL),
(60, 'gatax', 'gatax@gmail.com', '$2y$10$p6HlFmkbX230qDMGN7FYg..FC2bA6Vgg5zTSHgvDumA/RjRRweEpy', '2025-01-21 16:30:05', 3, NULL),
(61, 'lang', 'galanghanafi9131@gmail.com', '$2y$10$EXRFxN8ZPQGaEBNvIIWRb.e0/bYLz9ihM/LvSmxwuBd/uAjzYsGzq', '2025-01-21 17:06:47', 3, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `user_feedback`
--

CREATE TABLE `user_feedback` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `selected_mood` varchar(100) NOT NULL,
  `selected_habit` varchar(100) NOT NULL,
  `selected_liking` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `user_feedback`
--

INSERT INTO `user_feedback` (`id`, `user_id`, `username`, `selected_mood`, `selected_habit`, `selected_liking`, `created_at`) VALUES
(1, 31, '', 'Marah', 'Membaca', 'Memasak', '2024-12-24 22:39:56'),
(2, 35, '', 'Bahagia', 'Olahraga', 'Musik', '2024-12-24 23:36:25'),
(3, 31, '', 'Bahagia', 'Olahraga', 'Makan', '2024-12-24 23:53:26'),
(4, 31, '', 'Cemas', 'Olahraga', 'Memasak', '2024-12-24 23:55:41'),
(5, 31, '', 'Marah', 'Olahraga', 'Musik', '2024-12-25 05:38:57'),
(6, 31, '', 'Bahagia', 'Membaca', 'Olahraga', '2024-12-25 05:39:24'),
(7, 39, '', 'Sedih', 'Olahraga', 'Traveling', '2024-12-25 21:33:34'),
(8, 41, '', 'Bahagia', 'Olahraga', 'Makan', '2024-12-25 21:33:53'),
(9, 31, '', 'Bahagia', 'Menonton Film', 'Memasak', '2024-12-26 01:49:01'),
(10, 43, '', 'Sedih', 'Nongkrong', 'Memasak', '2024-12-26 02:33:27'),
(11, 45, '', 'Bahagia', 'Nongkrong', 'Musik', '2024-12-26 11:58:31'),
(12, 39, '', 'Cemas', 'Nongkrong', 'Traveling', '2024-12-26 16:29:34'),
(13, 41, '', 'Sedih', 'Olahraga', 'Olahraga', '2025-01-02 12:01:56'),
(14, 56, '', 'Cemas', 'Menonton Film', 'Musik', '2025-01-04 21:50:43'),
(15, 41, '', 'Marah', 'Olahraga', 'Traveling', '2025-01-06 07:55:28'),
(16, 41, '', 'Bahagia', 'Olahraga', 'Traveling', '2025-01-08 07:46:22'),
(17, 41, '', 'Marah', 'Nongkrong', 'Traveling', '2025-01-13 17:39:55'),
(18, 59, '', 'Sedih', 'Nongkrong', 'Musik', '2025-01-20 09:44:58'),
(19, 60, '', 'Bahagia', 'Olahraga', 'Musik', '2025-01-21 23:35:54'),
(20, 42, '', 'Bahagia', 'Olahraga', 'Musik', '2025-01-22 20:31:03'),
(21, 42, '', 'Bahagia', 'Olahraga', 'Musik', '2025-01-22 20:31:29'),
(22, 42, '', 'Bahagia', 'Olahraga', 'Musik', '2025-01-22 20:40:05');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `appointment`
--
ALTER TABLE `appointment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_username` (`username`);

--
-- Indeks untuk tabel `consultant_schedule`
--
ALTER TABLE `consultant_schedule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `consultant_id` (`consultant_id`);

--
-- Indeks untuk tabel `daily_feedback`
--
ALTER TABLE `daily_feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeks untuk tabel `user_feedback`
--
ALTER TABLE `user_feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `appointment`
--
ALTER TABLE `appointment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT untuk tabel `consultant_schedule`
--
ALTER TABLE `consultant_schedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `daily_feedback`
--
ALTER TABLE `daily_feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT untuk tabel `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT untuk tabel `user_feedback`
--
ALTER TABLE `user_feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `appointment`
--
ALTER TABLE `appointment`
  ADD CONSTRAINT `fk_username` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `consultant_schedule`
--
ALTER TABLE `consultant_schedule`
  ADD CONSTRAINT `consultant_schedule_ibfk_1` FOREIGN KEY (`consultant_id`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `daily_feedback`
--
ALTER TABLE `daily_feedback`
  ADD CONSTRAINT `daily_feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `user_feedback`
--
ALTER TABLE `user_feedback`
  ADD CONSTRAINT `user_feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
