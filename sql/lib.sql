SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- Create Database
DROP DATABASE IF EXISTS `library_db`;
CREATE DATABASE `library_db` 
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `library_db`;

-- Create Tables with proper auto-increment and constraints

-- Branch Table
CREATE TABLE IF NOT EXISTS `branch` (
  `name` varchar(100) NOT NULL,
  `street` varchar(80) NOT NULL,
  `city` varchar(20) NOT NULL,
  `pincode` int NOT NULL,
  `phone` bigint NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `unique_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `branch` (`name`, `street`, `city`, `pincode`, `phone`) VALUES
('thapar', 'prem nagar', 'patiala', 147004, 0);
-- Admin Table
CREATE TABLE IF NOT EXISTS `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(40) NOT NULL,
  `password` varchar(60) NOT NULL, -- Increased for secure password storage
  `branch_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  FOREIGN KEY (`branch_name`) REFERENCES `branch` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Table
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(40) NOT NULL,
  `Address` varchar(100) NOT NULL,
  `username` varchar(15) NOT NULL UNIQUE,
  `password` varchar(60) NOT NULL,
  `date_signup` date NOT NULL DEFAULT (CURRENT_DATE),
  `phone_no` BIGINT NULL, -- Added phone number here
  `branch_name` VARCHAR(100) NULL, -- Added branch association (nullable for now)
  PRIMARY KEY (`user_id`),
  FOREIGN KEY (`branch_name`) REFERENCES `branch` (`name`) ON DELETE SET NULL ON UPDATE CASCADE -- Added FK constraint, handle branch deletion
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Card Table
CREATE TABLE IF NOT EXISTS `card` (
  `Card_no` int NOT NULL AUTO_INCREMENT,
  `fines` decimal(6,2) DEFAULT 0.00,
  `req_books` int DEFAULT 0,
  `user_id` int NOT NULL UNIQUE, -- Ensure one card per user
  PRIMARY KEY (`Card_no`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE -- Cascade delete if user is deleted
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Book Table
CREATE TABLE IF NOT EXISTS `book` (
  `id` int NOT NULL AUTO_INCREMENT,
  `isbn` varchar(13) NOT NULL,
  `title` varchar(100) NOT NULL,
  `author` varchar(100) NOT NULL,
  `branch_name` varchar(100) NOT NULL, 
  `available_copies` int NOT NULL DEFAULT 0,
  `lost_cost` decimal(10,2) NOT NULL DEFAULT 500.00,
  PRIMARY KEY (`id`),
  UNIQUE KEY `isbn` (`isbn`),
  FOREIGN KEY (`branch_name`) REFERENCES `branch` (`name`) ON UPDATE CASCADE -- Update book if branch name changes
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Request Book Table
CREATE TABLE IF NOT EXISTS `request_book` (
  `req_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `book_id` int NOT NULL,
  `branch_name` varchar(100) NOT NULL,
  `date_req` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `card_no` int NOT NULL,
  PRIMARY KEY (`req_id`),
  FOREIGN KEY (`book_id`) REFERENCES `book` (`id`) ON DELETE CASCADE, -- Cascade delete request if book deleted
  FOREIGN KEY (`branch_name`) REFERENCES `branch` (`name`) ON UPDATE CASCADE, -- Update request if branch name changes
  FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE, -- Cascade delete request if user deleted
  FOREIGN KEY (`card_no`) REFERENCES `card` (`Card_no`) ON DELETE CASCADE -- Cascade delete request if card deleted
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Issue Book Table
CREATE TABLE IF NOT EXISTS `issuebook` (
  `issue_id` int NOT NULL AUTO_INCREMENT,
  `req_id` int NOT NULL,
  `card_no` int NOT NULL,
  `issue_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `return_date` DATETIME NULL DEFAULT NULL, -- Added return date
  PRIMARY KEY (`issue_id`),
  FOREIGN KEY (`req_id`) REFERENCES `request_book` (`req_id`) ON DELETE CASCADE, -- Cascade delete issue if request deleted
  FOREIGN KEY (`card_no`) REFERENCES `card` (`Card_no`) ON DELETE CASCADE -- Cascade delete issue if card deleted
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Fine Payments Table
CREATE TABLE IF NOT EXISTS `fine_payments` (
  `payment_id` INT AUTO_INCREMENT,
  `card_no` INT NOT NULL,
  `amount` DECIMAL(6,2) NOT NULL,
  `payment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  FOREIGN KEY (`card_no`) REFERENCES `card` (`Card_no`) ON DELETE CASCADE -- Cascade delete payment if card deleted
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Procedure for User Login
DELIMITER //
DROP PROCEDURE IF EXISTS user_login; -- Add drop if exists
CREATE PROCEDURE user_login(
    IN p_username VARCHAR(15),
    IN p_password VARCHAR(60),
    OUT p_success BOOLEAN,
    OUT p_user_id INT,
    OUT p_card_no INT -- Added card_no output
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_card_no INT;
    
    -- Find user_id based on credentials
    SELECT user_id INTO v_user_id
    FROM `user` 
    WHERE username = p_username AND password = p_password -- Consider hashing passwords in a real app
    LIMIT 1; 
    
    IF v_user_id IS NOT NULL THEN
        -- Find corresponding card_no
        SELECT Card_no INTO v_card_no
        FROM `card`
        WHERE user_id = v_user_id
        LIMIT 1; 

        IF v_card_no IS NOT NULL THEN
             SET p_success = TRUE;
             SET p_user_id = v_user_id;
             SET p_card_no = v_card_no;
        ELSE
             SET p_success = FALSE;
             SET p_user_id = NULL;
             SET p_card_no = NULL;
        END IF;
    ELSE
        SET p_success = FALSE;
        SET p_user_id = NULL;
        SET p_card_no = NULL;
    END IF;
END //
DELIMITER ;

-- Procedure for User Signup
DELIMITER //
DROP PROCEDURE IF EXISTS user_signup;
CREATE PROCEDURE user_signup(
    IN p_name VARCHAR(40),
    IN p_address VARCHAR(100),
    IN p_username VARCHAR(15),
    IN p_password VARCHAR(60),
    IN p_phone_no BIGINT,
    IN p_branch_name VARCHAR(100),
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(100)
)
main: BEGIN
    DECLARE user_exists INT;
    DECLARE new_user_id INT;
    DECLARE v_branch_exists BOOLEAN;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET p_success = FALSE;
        SET p_message = 'Error occurred during registration';
        ROLLBACK;
    END;

    -- Check if username already exists
    SELECT COUNT(*) INTO user_exists
    FROM `user`
    WHERE username = p_username;

    IF user_exists > 0 THEN
        SET p_success = FALSE;
        SET p_message = 'Username already exists';
        LEAVE main;
    END IF;

    -- Check if branch exists (if provided)
    IF p_branch_name IS NOT NULL AND p_branch_name != '' THEN
        SELECT EXISTS(SELECT 1 FROM branch WHERE name = p_branch_name) INTO v_branch_exists;
        IF NOT v_branch_exists THEN
            SET p_success = FALSE;
            SET p_message = 'Invalid branch name specified';
            LEAVE main;
        END IF;
    ELSE
        SET p_branch_name = NULL;
    END IF;

    START TRANSACTION;

    INSERT INTO `user` (Name, Address, username, password, phone_no, branch_name)
    VALUES (p_name, p_address, p_username, p_password, p_phone_no, p_branch_name);

    SET new_user_id = LAST_INSERT_ID();

    INSERT INTO `card` (user_id)
    VALUES (new_user_id);

    COMMIT;

    SET p_success = TRUE;
    SET p_message = 'User registered successfully';

END //
DELIMITER ;

-- Procedure to Add Book
DELIMITER //
CREATE PROCEDURE add_book(
    IN p_isbn               VARCHAR(13),
    IN p_title              VARCHAR(100),
    IN p_author             VARCHAR(100),
    IN p_available_copies   INT,
    IN p_branch_name        VARCHAR(100),
    IN p_lost_cost          DECIMAL(10,2),
    OUT p_success           BOOLEAN,
    OUT p_message           VARCHAR(100),
    OUT p_book_id           INT
)
main: BEGIN
    DECLARE v_branch_exists  BOOLEAN;
    DECLARE book_count       INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_success = FALSE;
        SET p_message = 'Error occurred while adding book';
    END;

    -- Check branch exists
    SELECT EXISTS(SELECT 1 FROM branch WHERE name = p_branch_name)
    INTO v_branch_exists;
    IF NOT v_branch_exists THEN
        SET p_success = FALSE;
        SET p_message = 'Invalid branch specified';
        LEAVE main;
    END IF;

    -- Check for duplicate ISBN
    SELECT COUNT(*) INTO book_count
    FROM book
    WHERE isbn = p_isbn;
    IF book_count > 0 THEN
        SET p_success = FALSE;
        SET p_message = 'A book with this ISBN already exists';
        LEAVE main;
    END IF;

    START TRANSACTION;
      INSERT INTO book
        (isbn, title, author, branch_name, available_copies, lost_cost)
      VALUES
        (p_isbn, p_title, p_author, p_branch_name, p_available_copies, p_lost_cost);
    COMMIT;

    SET p_success = TRUE;
    SET p_message = 'Book added successfully';
    SET p_book_id = LAST_INSERT_ID(); -- Get the ID of the newly inserted book
END //
DELIMITER ;


-- Procedure to Get All Books
DELIMITER //
CREATE PROCEDURE get_all_books()
BEGIN
    SELECT 
        b.id,
        b.isbn,
        b.title,
        b.author,
        b.branch_name,
        b.available_copies,
        b.lost_cost,
        br.phone as branch_phone,
        br.city as branch_city
    FROM book b
    LEFT JOIN branch br ON b.branch_name = br.name
    ORDER BY b.title ASC;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE get_borrowed_books(
    IN p_user_id INT
)
BEGIN
    SELECT 
        i.issue_id,
        b.title,
        b.author,
        i.issue_date,
        DATE_ADD(i.issue_date, INTERVAL 14 DAY) as due_date
    FROM request_book rb
    INNER JOIN issuebook i ON rb.req_id = i.req_id
    INNER JOIN book b ON rb.book_id = b.id
    WHERE rb.user_id = p_user_id
    AND i.return_date IS NULL
    ORDER BY i.issue_date DESC;
END //

-- Procedure to get user statistics
CREATE PROCEDURE get_user_stats(
    IN p_user_id INT,
    OUT p_total_borrowed INT,
    OUT p_current_borrowed INT,
    OUT p_total_fines DECIMAL(6,2)
)
BEGIN
    -- Get total books ever borrowed
    SELECT COUNT(DISTINCT rb.book_id) INTO p_total_borrowed
    FROM request_book rb
    INNER JOIN issuebook i ON rb.req_id = i.req_id
    WHERE rb.user_id = p_user_id;

    -- Get currently borrowed books count
    SELECT COUNT(DISTINCT rb.book_id) INTO p_current_borrowed
    FROM request_book rb
    INNER JOIN issuebook i ON rb.req_id = i.req_id
    WHERE rb.user_id = p_user_id
    AND i.return_date IS NULL;

    -- Get total fines
    SELECT COALESCE(fines, 0) INTO p_total_fines
    FROM card
    WHERE user_id = p_user_id;
END //
DELIMITER ;


DELIMITER //

DROP PROCEDURE IF EXISTS request_book; -- Renamed to avoid conflict with table name
CREATE PROCEDURE request_book(
    IN p_user_id INT,
    IN p_book_id INT,
    IN p_branch_name VARCHAR(100),
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(255)
)
main: BEGIN
    DECLARE v_available_copies INT;
    DECLARE v_card_no INT;
    DECLARE v_req_id INT;
    DECLARE v_book_exists INT;
    DECLARE v_user_exists INT;
    DECLARE v_branch_exists INT;
    DECLARE v_already_borrowed INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_success = FALSE;
        SET p_message = 'An error occurred during the request process.';
    END;

    -- Check if user exists
    SELECT COUNT(*) INTO v_user_exists FROM `user` WHERE user_id = p_user_id;
    IF v_user_exists = 0 THEN
        SET p_success = FALSE;
        SET p_message = 'Invalid user ID.';
        LEAVE main;
    END IF;

    -- Check if branch exists
    SELECT COUNT(*) INTO v_branch_exists FROM `branch` WHERE name = p_branch_name;
     IF v_branch_exists = 0 THEN
        SET p_success = FALSE;
        SET p_message = 'Invalid branch name.';
        LEAVE main;
    END IF;

    -- Check if book exists in the specified branch and get available copies
    SELECT COUNT(*), available_copies INTO v_book_exists, v_available_copies
    FROM `book`
    WHERE id = p_book_id AND branch_name = p_branch_name;

    IF v_book_exists = 0 THEN
        SET p_success = FALSE;
        SET p_message = 'Book not found in the specified branch.';
        LEAVE main;
    END IF;

    -- Check if the book is available
    IF v_available_copies <= 0 THEN
        SET p_success = FALSE;
        SET p_message = 'Book is currently not available.';
        LEAVE main;
    END IF;

    -- Get the user's card number
    SELECT Card_no INTO v_card_no FROM `card` WHERE user_id = p_user_id;
    IF v_card_no IS NULL THEN
        SET p_success = FALSE;
        SET p_message = 'User does not have a library card.';
        LEAVE main;
    END IF;

    -- Check if the user has already borrowed this specific book and not returned it
    SELECT COUNT(*) INTO v_already_borrowed
    FROM request_book rb
    JOIN issuebook ib ON rb.req_id = ib.req_id
    WHERE rb.user_id = p_user_id
      AND rb.book_id = p_book_id
      AND ib.return_date IS NULL;

    IF v_already_borrowed > 0 THEN
        SET p_success = FALSE;
        SET p_message = 'You have already borrowed this book and not returned it.';
        LEAVE main;
    END IF;


    START TRANSACTION;

    -- Decrement available copies
    UPDATE `book`
    SET available_copies = available_copies - 1
    WHERE id = p_book_id;

    -- Insert into request_book table
    INSERT INTO `request_book` (user_id, book_id, branch_name, card_no)
    VALUES (p_user_id, p_book_id, p_branch_name, v_card_no);

    -- Get the last inserted request ID
    SET v_req_id = LAST_INSERT_ID();

    -- Insert into issuebook table
    INSERT INTO `issuebook` (req_id, card_no)
    VALUES (v_req_id, v_card_no);

    COMMIT;

    SET p_success = TRUE;
    SET p_message = 'Book requested and issued successfully.';

END //

DELIMITER ;