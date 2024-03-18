-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 17, 2024 at 03:14 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*test*/
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `roadmapdatabase`
--

-- --------------------------------------------------------

--
-- Table structure for table `archived_comments`
--

CREATE TABLE `archived_comments` (
  `id` int(11) NOT NULL,
  `archived_task_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `text` text NOT NULL,
  `archived_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `archived_comments`
--

INSERT INTO `archived_comments` (`id`, `archived_task_id`, `user_id`, `text`, `archived_at`) VALUES
(1, 45, 15, 'awdawdwada', '2024-03-13 22:21:59'),
(2, 46, 15, 'adwwaadaw', '2024-03-13 22:21:59');

-- --------------------------------------------------------

--
-- Table structure for table `archived_roadmaps`
--

CREATE TABLE `archived_roadmaps` (
  `id` int(11) NOT NULL,
  `original_roadmap_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `end_time` datetime DEFAULT NULL,
  `archived_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_public` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `archived_roadmaps`
--

INSERT INTO `archived_roadmaps` (`id`, `original_roadmap_id`, `user_id`, `title`, `end_time`, `archived_at`, `is_public`) VALUES
(1, 7, 15, 'hehe', '2024-03-13 00:00:00', '2024-03-13 19:03:07', 0),
(2, 7, 15, 'hehe', '2024-03-13 00:00:00', '2024-03-13 19:04:56', 0),
(3, 7, 15, 'hehe', '2024-03-13 00:00:00', '2024-03-13 19:06:08', 0),
(4, 7, 15, 'hehe', '2024-03-13 00:00:00', '2024-03-13 21:37:32', 0),
(5, 7, 15, 'hehe', '2024-03-13 00:00:00', '2024-03-13 21:38:00', 0),
(7, 7, 15, 'hehe', '2024-03-13 00:00:00', '2024-03-13 22:15:55', 0),
(8, 7, 15, 'hehe', '2024-03-13 00:00:00', '2024-03-13 22:19:13', 0),
(9, 7, 15, 'hehe', '2024-03-13 00:00:00', '2024-03-13 22:21:59', 0),
(10, 7, 15, 'hehe', '2024-03-13 00:00:00', '2024-03-13 22:22:12', 0),
(11, 7, 15, 'hehe', '2024-03-13 00:00:00', '2024-03-14 23:28:01', 0),
(12, 7, 15, 'hehe', '2024-03-13 00:00:00', '2024-03-14 23:28:05', 0);

-- --------------------------------------------------------

--
-- Table structure for table `archived_tasks`
--

CREATE TABLE `archived_tasks` (
  `id` int(11) NOT NULL,
  `archived_roadmap_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `priority` varchar(50) DEFAULT NULL,
  `specific_time` time NOT NULL,
  `status` enum('pending','completed') NOT NULL DEFAULT 'pending',
  `archived_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `archived_tasks`
--

INSERT INTO `archived_tasks` (`id`, `archived_roadmap_id`, `title`, `priority`, `specific_time`, `status`, `archived_at`) VALUES
(1, 1, 'hehe', NULL, '00:00:00', 'pending', '2024-03-13 19:03:07'),
(2, 2, 'hehe', NULL, '00:00:00', 'pending', '2024-03-13 19:04:56'),
(3, 3, 'hehe', NULL, '00:00:00', 'pending', '2024-03-13 19:06:08'),
(4, 3, 'ahhhh', NULL, '00:00:00', 'pending', '2024-03-13 19:06:08'),
(5, 3, 'for third roadmap', NULL, '00:00:00', 'pending', '2024-03-13 19:06:08'),
(6, 3, 'archivvvvved', NULL, '06:30:00', 'pending', '2024-03-13 19:06:08'),
(10, 4, 'hehe', NULL, '00:00:00', 'pending', '2024-03-13 21:37:32'),
(11, 4, 'ahhhh', NULL, '00:00:00', 'pending', '2024-03-13 21:37:32'),
(12, 4, 'for third roadmap', NULL, '00:00:00', 'pending', '2024-03-13 21:37:32'),
(13, 4, 'archivvvvved', NULL, '06:30:00', 'pending', '2024-03-13 21:37:32'),
(17, 5, 'hehe', NULL, '00:00:00', 'pending', '2024-03-13 21:38:00'),
(18, 5, 'ahhhh', NULL, '00:00:00', 'pending', '2024-03-13 21:38:00'),
(19, 5, 'for third roadmap', NULL, '00:00:00', 'pending', '2024-03-13 21:38:00'),
(20, 5, 'archivvvvved', NULL, '06:30:00', 'pending', '2024-03-13 21:38:00'),
(31, 7, 'hehe', NULL, '00:00:00', 'pending', '2024-03-13 22:15:55'),
(32, 7, 'ahhhh', NULL, '00:00:00', 'pending', '2024-03-13 22:15:55'),
(33, 7, 'for third roadmap', NULL, '00:00:00', 'pending', '2024-03-13 22:15:55'),
(34, 7, 'archivvvvved', NULL, '06:30:00', 'pending', '2024-03-13 22:15:55'),
(38, 8, 'hehe', NULL, '00:00:00', 'pending', '2024-03-13 22:19:13'),
(39, 8, 'ahhhh', NULL, '00:00:00', 'pending', '2024-03-13 22:19:13'),
(40, 8, 'for third roadmap', NULL, '00:00:00', 'pending', '2024-03-13 22:19:13'),
(41, 8, 'archivvvvved', NULL, '06:30:00', 'pending', '2024-03-13 22:19:13'),
(45, 9, 'hehe', NULL, '00:00:00', 'pending', '2024-03-13 22:21:59'),
(46, 9, 'ahhhh', NULL, '00:00:00', 'pending', '2024-03-13 22:21:59'),
(47, 9, 'for third roadmap', NULL, '00:00:00', 'pending', '2024-03-13 22:21:59'),
(48, 9, 'archivvvvved', NULL, '06:30:00', 'pending', '2024-03-13 22:21:59'),
(52, 10, 'hehe', NULL, '00:00:00', 'pending', '2024-03-13 22:22:12'),
(53, 10, 'ahhhh', NULL, '00:00:00', 'pending', '2024-03-13 22:22:12'),
(54, 10, 'for third roadmap', NULL, '00:00:00', 'pending', '2024-03-13 22:22:12'),
(55, 10, 'archivvvvved', NULL, '06:30:00', 'pending', '2024-03-13 22:22:12'),
(59, 11, 'hehe', NULL, '00:00:00', 'pending', '2024-03-14 23:28:01'),
(60, 11, 'ahhhh', NULL, '00:00:00', 'pending', '2024-03-14 23:28:01'),
(61, 11, 'for third roadmap', NULL, '00:00:00', 'pending', '2024-03-14 23:28:01'),
(62, 11, 'archivvvvved', NULL, '06:30:00', 'pending', '2024-03-14 23:28:01'),
(66, 12, 'hehe', NULL, '00:00:00', 'pending', '2024-03-14 23:28:05'),
(67, 12, 'ahhhh', NULL, '00:00:00', 'pending', '2024-03-14 23:28:05'),
(68, 12, 'for third roadmap', NULL, '00:00:00', 'pending', '2024-03-14 23:28:05'),
(69, 12, 'archivvvvved', NULL, '06:30:00', 'pending', '2024-03-14 23:28:05');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roadmaps`
--

CREATE TABLE `roadmaps` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `end_time` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `reset_at` datetime NOT NULL DEFAULT current_timestamp(),
  `is_reset` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roadmaps`
--

INSERT INTO `roadmaps` (`id`, `user_id`, `title`, `end_time`, `created_at`, `reset_at`, `is_reset`) VALUES
(7, 15, 'hehe', '2024-03-13 00:00:00', '2024-03-13 15:25:26', '2024-03-15 00:28:01', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `roadmap_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `priority` varchar(50) DEFAULT NULL,
  `specific_time` time NOT NULL,
  `status` enum('pending','completed') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `roadmap_id`, `title`, `priority`, `specific_time`, `status`, `created_at`) VALUES
(40, 7, 'hehe', NULL, '00:00:00', 'pending', '2024-03-13 15:25:43'),
(41, 7, 'ahhhh', NULL, '00:00:00', 'pending', '2024-03-13 19:05:34'),
(42, 7, 'for third roadmap', NULL, '00:00:00', 'pending', '2024-03-13 19:05:41'),
(43, 7, 'archivvvvved', NULL, '06:30:00', 'pending', '2024-03-13 19:05:46');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `created_at`, `last_login`) VALUES
(15, 'hello', '$2a$10$bHDQUfVo5pBylmDvwDFNj.3EjwG73DfMECIath3NXQgzbNWwrr9u2', '2024-02-10 06:37:41', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `archived_comments`
--
ALTER TABLE `archived_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `archived_task_id` (`archived_task_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `archived_roadmaps`
--
ALTER TABLE `archived_roadmaps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `archived_tasks`
--
ALTER TABLE `archived_tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `archived_roadmap_id` (`archived_roadmap_id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `roadmaps`
--
ALTER TABLE `roadmaps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `roadmap_id` (`roadmap_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `archived_comments`
--
ALTER TABLE `archived_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `archived_roadmaps`
--
ALTER TABLE `archived_roadmaps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `archived_tasks`
--
ALTER TABLE `archived_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `roadmaps`
--
ALTER TABLE `roadmaps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `archived_comments`
--
ALTER TABLE `archived_comments`
  ADD CONSTRAINT `archived_comments_ibfk_1` FOREIGN KEY (`archived_task_id`) REFERENCES `archived_tasks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `archived_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `archived_roadmaps`
--
ALTER TABLE `archived_roadmaps`
  ADD CONSTRAINT `archived_roadmaps_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `archived_tasks`
--
ALTER TABLE `archived_tasks`
  ADD CONSTRAINT `archived_tasks_ibfk_1` FOREIGN KEY (`archived_roadmap_id`) REFERENCES `archived_roadmaps` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `roadmaps`
--
ALTER TABLE `roadmaps`
  ADD CONSTRAINT `roadmaps_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`roadmap_id`) REFERENCES `roadmaps` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
