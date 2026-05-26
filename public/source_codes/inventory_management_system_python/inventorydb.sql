-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 30, 2025 at 12:23 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `inventorydb`
--

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password_hash` varchar(512) DEFAULT NULL,
  `salt` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `full_name`, `username`, `password_hash`, `salt`) VALUES
(1, 'Squidward Tentacles', 'Squidward', '88b1c3a02d097be7f6b441649fc14de4dd60a3b870168dcbe476b7075806541a', '509c01faaef91befb3be3ff35e520baf'),
(3, 'Celine Sausa', 'Celine', 'c607c7ad95aa4c1458af804d1d7934314a54292811a4f9d3f92c152d9f298959', 'd8ab453ed05c56efe9f78bc68fc4063e');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `category` varchar(255) NOT NULL DEFAULT 'Uncategorized',
  `sku` varchar(50) NOT NULL DEFAULT '',
  `quantity` int(11) NOT NULL DEFAULT 0,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `stock`, `category`, `sku`, `quantity`, `price`) VALUES
(1, 'Pencil', NULL, 'Office Supplies', '12345-AKBFWIUV', 25, 12.00),
(2, 'Pen', NULL, 'Office Supplies', '9574602-NVHNI', 36, 15.00),
(3, 'Wallet', NULL, 'Clothing', '84907-NJSICS', 12, 150.00),
(4, 'T-shirt (S)', NULL, 'Clothing', '1927366-KJOEUE', 18, 124.00),
(6, 'T-shirt (M)', NULL, 'Clothing', '1927366-KJOEUF', 27, 124.00),
(7, 'T-shirt (L)', NULL, 'Clothing', '1927366-KJOEUG', 12, 124.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
