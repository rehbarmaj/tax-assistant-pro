-- Database schema for Tax Assistant Pro

CREATE TABLE IF NOT EXISTS control_groups (
    id VARCHAR(10) PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS sub_control_groups (
    id VARCHAR(10) PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    control_group_id VARCHAR(10),
    FOREIGN KEY (control_group_id) REFERENCES control_groups(id)
);

CREATE TABLE IF NOT EXISTS control_accounts (
    id VARCHAR(10) PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    sub_control_group_id VARCHAR(10),
    FOREIGN KEY (sub_control_group_id) REFERENCES sub_control_groups(id)
);

CREATE TABLE IF NOT EXISTS ledger_accounts (
    id VARCHAR(20) PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    control_account_id VARCHAR(10),
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    ntn VARCHAR(50),
    strn VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    contact_person VARCHAR(255),
    contact_number VARCHAR(50),
    payment_terms VARCHAR(100),
    FOREIGN KEY (control_account_id) REFERENCES control_accounts(id)
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(50),
    purchase_price DECIMAL(15, 2) NOT NULL,
    sale_price DECIMAL(15, 2) NOT NULL,
    hsn_sac VARCHAR(50),
    tax_rate_id VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS tax_rates (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rate DECIMAL(5, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL UNIQUE,
    login VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50),
    module VARCHAR(100) NOT NULL,
    can_view BOOLEAN DEFAULT FALSE,
    can_add BOOLEAN DEFAULT FALSE,
    can_edit BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    UNIQUE (user_id, module),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payment_vouchers (
    id VARCHAR(50) PRIMARY KEY,
    voucher_number VARCHAR(50) NOT NULL UNIQUE,
    date DATE NOT NULL,
    party_id VARCHAR(20),
    amount DECIMAL(15, 2) NOT NULL,
    payment_mode VARCHAR(50),
    narration TEXT,
    currency VARCHAR(10),
    FOREIGN KEY (party_id) REFERENCES ledger_accounts(id)
);

CREATE TABLE IF NOT EXISTS receipt_vouchers (
    id VARCHAR(50) PRIMARY KEY,
    voucher_number VARCHAR(50) NOT NULL UNIQUE,
    date DATE NOT NULL,
    party_id VARCHAR(20),
    amount DECIMAL(15, 2) NOT NULL,
    receipt_mode VARCHAR(50),
    narration TEXT,
    currency VARCHAR(10),
    FOREIGN KEY (party_id) REFERENCES ledger_accounts(id)
);

CREATE TABLE IF NOT EXISTS journal_vouchers (
    id VARCHAR(50) PRIMARY KEY,
    voucher_number VARCHAR(50) NOT NULL UNIQUE,
    date DATE NOT NULL,
    narration TEXT,
    currency VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS journal_voucher_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voucher_id VARCHAR(50),
    account_id VARCHAR(20),
    debit DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    credit DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    narration TEXT,
    FOREIGN KEY (voucher_id) REFERENCES journal_vouchers(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES ledger_accounts(id)
);

-- Tables for Sales and Purchases
CREATE TABLE IF NOT EXISTS sales_notes (
    id VARCHAR(50) PRIMARY KEY,
    note_number VARCHAR(50) NOT NULL UNIQUE,
    date DATE NOT NULL,
    customer_id VARCHAR(20),
    sub_total DECIMAL(15, 2) NOT NULL,
    discount_amount DECIMAL(15, 2) NOT NULL,
    total_tax_amount DECIMAL(15, 2) NOT NULL,
    grand_total DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10),
    narration TEXT,
    FOREIGN KEY (customer_id) REFERENCES ledger_accounts(id)
);

CREATE TABLE IF NOT EXISTS sales_note_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    note_id VARCHAR(50),
    product_id VARCHAR(50),
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    tax_amount DECIMAL(15, 2) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (note_id) REFERENCES sales_notes(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS purchase_notes (
    id VARCHAR(50) PRIMARY KEY,
    note_number VARCHAR(50) NOT NULL UNIQUE,
    date DATE NOT NULL,
    supplier_id VARCHAR(20),
    sub_total DECIMAL(15, 2) NOT NULL,
    discount_amount DECIMAL(15, 2) NOT NULL,
    total_tax_amount DECIMAL(15, 2) NOT NULL,
    grand_total DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10),
    narration TEXT,
    FOREIGN KEY (supplier_id) REFERENCES ledger_accounts(id)
);

CREATE TABLE IF NOT EXISTS purchase_note_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    note_id VARCHAR(50),
    product_id VARCHAR(50),
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    tax_amount DECIMAL(15, 2) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (note_id) REFERENCES purchase_notes(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
