-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 22, 2020 at 03:14 AM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `part_directory`
--

CREATE TABLE `part_directory` (
  `KeyId` int(11) NOT NULL,
  `PartId` varchar(13) DEFAULT NULL,
  `Status` varchar(32) DEFAULT NULL,
  `TargetWt` int(11) DEFAULT NULL,
  `PlusMinusWt` int(11) DEFAULT NULL,
  `ApproveTime` timestamp NULL DEFAULT current_timestamp(),
  `RejectTime` timestamp NULL DEFAULT current_timestamp(),
  `PartCreationDate` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `part_directory`
--

INSERT INTO `part_directory` (`KeyId`, `PartId`, `Status`, `TargetWt`, `PlusMinusWt`, `ApproveTime`, `RejectTime`, `PartCreationDate`) VALUES
(4, 'DET001', 'Reject', 25, 5, '2020-12-22 00:51:54', '2020-12-22 01:42:34', '2020-12-22 00:49:29'),
(5, 'DET002', 'Cancel', 25, 2, '2020-12-22 01:24:59', '2020-12-22 01:24:56', '2020-12-22 00:49:39'),
(6, 'TRC001', 'Reject', 20, 10, NULL, '2020-12-22 01:24:43', '2020-12-22 00:49:46'),
(7, 'TRC002', 'Approve', 30, 1, '2020-12-22 01:24:53', NULL, '2020-12-22 00:49:58'),
(12, 'DET001', 'Pending', 25, 2, NULL, NULL, '2020-12-22 02:06:33');

-- --------------------------------------------------------

--
-- Table structure for table `weight_detroit`
--

CREATE TABLE `weight_detroit` (
  `id` int(11) NOT NULL,
  `DetroitLotId` varchar(13) NOT NULL,
  `DetroitWeight1` varchar(5) DEFAULT NULL,
  `DetroitWeight2` varchar(5) DEFAULT NULL,
  `DetroitWeight3` varchar(5) DEFAULT NULL,
  `DetroitWeight4` varchar(5) DEFAULT NULL,
  `DetroitWeight5` varchar(5) DEFAULT NULL,
  `DetroitPlant` varchar(6) DEFAULT NULL,
  `DetroitCheckInTime` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `weight_detroit`
--

INSERT INTO `weight_detroit` (`id`, `DetroitLotId`, `DetroitWeight1`, `DetroitWeight2`, `DetroitWeight3`, `DetroitWeight4`, `DetroitWeight5`, `DetroitPlant`, `DetroitCheckInTime`) VALUES
(27, 'DET002', '23', '22', '14', '25', '25', 'DET002', '2020-12-22 02:05:45');

-- --------------------------------------------------------

--
-- Table structure for table `weight_traverse_city`
--

CREATE TABLE `weight_traverse_city` (
  `id` int(11) NOT NULL,
  `TraverseCityLotId` varchar(13) NOT NULL,
  `TraverseCityWeight1` varchar(5) DEFAULT NULL,
  `TraverseCityWeight2` varchar(5) DEFAULT NULL,
  `TraverseCityWeight3` varchar(5) DEFAULT NULL,
  `TraverseCityWeight4` varchar(5) DEFAULT NULL,
  `TraverseCityWeight5` varchar(5) DEFAULT NULL,
  `TraverseCityPlant` varchar(6) DEFAULT NULL,
  `TraverseCityCheckInTime` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `weight_traverse_city`
--

INSERT INTO `weight_traverse_city` (`id`, `TraverseCityLotId`, `TraverseCityWeight1`, `TraverseCityWeight2`, `TraverseCityWeight3`, `TraverseCityWeight4`, `TraverseCityWeight5`, `TraverseCityPlant`, `TraverseCityCheckInTime`) VALUES
(3, 'TRC001', '14', '', '', '', '', 'TRC001', '2020-12-22 01:46:11'),
(4, 'TRC002', '15', '33', '35', '31', '32', 'TC002', '2020-12-22 01:46:43');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `part_directory`
--
ALTER TABLE `part_directory`
  ADD PRIMARY KEY (`KeyId`),
  ADD KEY `PartId` (`PartId`);

--
-- Indexes for table `weight_detroit`
--
ALTER TABLE `weight_detroit`
  ADD PRIMARY KEY (`id`),
  ADD KEY `DetroitLotId` (`DetroitLotId`);

--
-- Indexes for table `weight_traverse_city`
--
ALTER TABLE `weight_traverse_city`
  ADD PRIMARY KEY (`id`),
  ADD KEY `TraverseCityLotId` (`TraverseCityLotId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `part_directory`
--
ALTER TABLE `part_directory`
  MODIFY `KeyId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `weight_detroit`
--
ALTER TABLE `weight_detroit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `weight_traverse_city`
--
ALTER TABLE `weight_traverse_city`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
