CREATE DATABASE stockpile;

-- Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY, 
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assets Table
CREATE TABLE assets (
    asset_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    symbol VARCHAR(10) NOT NULL,
    shares DECIMAL(10, 2) NOT NULL,
    purchase_price DECIMAL(10, 2) NOT NULL,
    current_price DECIMAL(10, 2), 
    bought_on DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);