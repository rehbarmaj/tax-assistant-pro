
-- This SQL schema creates the necessary tables for the Tax Assistant Pro application.
-- It is designed for MySQL.

--
-- Table structure for Chart of Accounts
--
CREATE TABLE `control_groups` (
    `id` VARCHAR(10) PRIMARY KEY,
    `code` VARCHAR(10) NOT NULL UNIQUE,
    `name` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `sub_control_groups` (
    `id` VARCHAR(10) PRIMARY KEY,
    `code` VARCHAR(10) NOT NULL UNIQUE,
    `name` VARCHAR(255) NOT NULL,
    `control_group_id` VARCHAR(10),
    FOREIGN KEY (`control_group_id`) REFERENCES `control_groups`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `control_accounts` (
    `id` VARCHAR(10) PRIMARY KEY,
    `code` VARCHAR(10) NOT NULL UNIQUE,
    `name` VARCHAR(255) NOT NULL,
    `sub_control_group_id` VARCHAR(10),
    FOREIGN KEY (`sub_control_group_id`) REFERENCES `sub_control_groups`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `ledger_accounts` (
    `id` VARCHAR(20) PRIMARY KEY,
    `code` VARCHAR(20) NOT NULL UNIQUE,
    `name` VARCHAR(255) NOT NULL,
    `control_account_id` VARCHAR(10),
    `balance` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `can_post` BOOLEAN NOT NULL DEFAULT TRUE,
    `currency` VARCHAR(10) NOT NULL,
    `ntn` VARCHAR(50) NULL,
    `strn` VARCHAR(50) NULL,
    `address` TEXT NULL,
    `city` VARCHAR(100) NULL,
    `province` VARCHAR(100) NULL,
    `contact_person` VARCHAR(255) NULL,
    `contact_number` VARCHAR(50) NULL,
    `payment_terms` VARCHAR(100) NULL,
    FOREIGN KEY (`control_account_id`) REFERENCES `control_accounts`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for Products & Tax
--
CREATE TABLE `tax_rates` (
    `id` VARCHAR(50) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `rate` DECIMAL(5, 2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `products` (
    `id` VARCHAR(50) PRIMARY KEY,
    `code` VARCHAR(50) NOT NULL UNIQUE,
    `name` VARCHAR(255) NOT NULL,
    `unit` VARCHAR(50) NULL,
    `purchase_price` DECIMAL(15, 2) NOT NULL,
    `sale_price` DECIMAL(15, 2) NOT NULL,
    `hsn_sac` VARCHAR(50) NULL,
    `tax_rate_id` VARCHAR(50) NULL,
    FOREIGN KEY (`tax_rate_id`) REFERENCES `tax_rates`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for Vouchers
--
CREATE TABLE `payment_vouchers` (
    `id` VARCHAR(50) PRIMARY KEY,
    `voucher_number` VARCHAR(50) NOT NULL,
    `date` DATE NOT NULL,
    `party_name` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `payment_mode` VARCHAR(50) NOT NULL,
    `narration` TEXT NULL,
    `currency` VARCHAR(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `receipt_vouchers` (
    `id` VARCHAR(50) PRIMARY KEY,
    `voucher_number` VARCHAR(50) NOT NULL,
    `date` DATE NOT NULL,
    `party_name` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `receipt_mode` VARCHAR(50) NOT NULL,
    `narration` TEXT NULL,
    `currency` VARCHAR(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- You would continue to add CREATE TABLE statements for:
-- journal_vouchers, journal_entries, purchase_notes, sale_notes, purchase_return_notes, sale_return_notes, document_items, users, user_permissions, etc.
