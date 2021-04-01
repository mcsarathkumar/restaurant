-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 04, 2021 at 09:37 AM
-- Server version: 5.7.31
-- PHP Version: 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `my_application_db`
--
CREATE DATABASE IF NOT EXISTS `my_application_db` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `my_application_db`;

-- --------------------------------------------------------

--
-- Table structure for table `restaurants`
--

DROP TABLE IF EXISTS `restaurants`;
CREATE TABLE IF NOT EXISTS `restaurants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `address1` text,
  `address2` text,
  `city` varchar(30) NOT NULL,
  `pincode` decimal(6,0) DEFAULT NULL,
  `phone` decimal(10,0) NOT NULL,
  `website` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `owner` int(11) DEFAULT NULL,
  `thumbnail_image` varchar(100) DEFAULT NULL,
  `banner_image` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `owner_id_idx_idx` (`owner`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `restaurants`
--

INSERT INTO `restaurants` (`id`, `name`, `address1`, `address2`, `city`, `pincode`, `phone`, `website`, `email`, `owner`, `thumbnail_image`, `banner_image`) VALUES
(1, 'First Restaurant', 'Chennai', 'Chennai', 'Chennai', '123456', '9876543210', 'abc.com', 'info@abc.com', 4, 'assets/images/87f05e05-e8df-4624-941b-f21ebc7ea4fb.png', 'assets/images/717357c3-d416-4ef6-9e0e-c825e9bdda29.png'),
(3, 'Hyderabad Restaurant', 'Hi Tech City', 'Marathalli', 'Hyderabad', '456798', '6547891234', 'hyderabad.com', 'info@hyderabad.com', 4, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `restaurant_images`
--

DROP TABLE IF EXISTS `restaurant_images`;
CREATE TABLE IF NOT EXISTS `restaurant_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image_name` varchar(100) DEFAULT NULL,
  `restaurant_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `restaurant_id_idx_idx` (`restaurant_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `restaurant_images`
--

INSERT INTO `restaurant_images` (`id`, `image_name`, `restaurant_id`) VALUES
(5, 'assets/images/717357c3-d416-4ef6-9e0e-c825e9bdda29.png', 1),
(7, 'assets/images/87f05e05-e8df-4624-941b-f21ebc7ea4fb.png', 1),
(8, 'assets/images/7b56a5d5-2b7b-44d5-983e-349290d4bbe6.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `restaurant_reviews`
--

DROP TABLE IF EXISTS `restaurant_reviews`;
CREATE TABLE IF NOT EXISTS `restaurant_reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `restaurant_id` int(11) DEFAULT NULL,
  `user_rating` tinyint(4) DEFAULT NULL,
  `user_comments` text CHARACTER SET latin1,
  `commented_by` int(11) DEFAULT NULL,
  `commented_on` date DEFAULT NULL,
  `owner_comments` text CHARACTER SET latin1,
  `owner_commented_by` int(11) DEFAULT NULL,
  `owner_commented_on` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `commented_by_idx` (`commented_by`),
  KEY `owner_commented_by_idx` (`owner_commented_by`),
  KEY `restaurant_id_idx` (`restaurant_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `restaurant_reviews`
--

INSERT INTO `restaurant_reviews` (`id`, `restaurant_id`, `user_rating`, `user_comments`, `commented_by`, `commented_on`, `owner_comments`, `owner_commented_by`, `owner_commented_on`) VALUES
(1, 1, 5, 'Awesome', 3, '2021-01-31', 'Thanks', 1, '2021-02-03'),
(2, 1, 2, 'Great Restaurant 1', 3, '2021-01-31', 'update 1', 2, '2021-01-31'),
(10, 1, 3, 'Good', 3, '2021-02-02', 'Thanks for your feedback', 4, '2021-02-04'),
(11, 1, 4, 'Works', 3, '2021-02-04', 'Thanks for your feedback!!', 4, '2021-02-04');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `firstname` varchar(30) NOT NULL,
  `lastname` varchar(30) NOT NULL,
  `phone` decimal(10,0) NOT NULL,
  `usertype` enum('owner','admin','customer') NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `firstname`, `lastname`, `phone`, `usertype`, `is_deleted`) VALUES
(1, 'skadmin@abc.com', '43de8d2f68b5361ca86d1bb9a105c0566900889c82dd2aa3ac624d9abe33d716', 'Sk', 'Admin', '8798456488', 'admin', 0),
(2, 'skowner1@abc.com', '43de8d2f68b5361ca86d1bb9a105c0566900889c82dd2aa3ac624d9abe33d716', 'Sarath', 'kumar 1', '9876543210', 'owner', 0),
(3, 'skcustomer@abc.com', '43de8d2f68b5361ca86d1bb9a105c0566900889c82dd2aa3ac624d9abe33d716', 'Sarath', 'kumar', '9876543210', 'customer', 0),
(4, 'skowner2@abc.com', '43de8d2f68b5361ca86d1bb9a105c0566900889c82dd2aa3ac624d9abe33d716', 'Sarath', 'kumar 2', '9876543210', 'owner', 0),
(5, 'priya@abc.com', '434952f8f0191e357803c5807d505620cf4478af072f4814ac526700a4a07967', 'Priya1', 'Dharshini', '9876543210', 'customer', 1),
(6, 'sarathkumar@gmail.com', '43de8d2f68b5361ca86d1bb9a105c0566900889c82dd2aa3ac624d9abe33d716', 'S', 'Kumar', '9876543210', 'admin', 0);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `restaurants`
--
ALTER TABLE `restaurants`
  ADD CONSTRAINT `owner_id` FOREIGN KEY (`owner`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Constraints for table `restaurant_images`
--
ALTER TABLE `restaurant_images`
  ADD CONSTRAINT `restaurant_id` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `restaurant_reviews`
--
ALTER TABLE `restaurant_reviews`
  ADD CONSTRAINT `commented_by_idx` FOREIGN KEY (`commented_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `owner_commented_by_idx` FOREIGN KEY (`owner_commented_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `restaurant_id_idx` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
