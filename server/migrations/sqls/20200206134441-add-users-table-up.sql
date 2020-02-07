CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(64) NOT NULL,
    last_name VARCHAR(64) NOT NULL,
    email VARCHAR(128) NOT NULL,
    username VARCHAR(64) NOT NULL,
    password_hash VARCHAR(512) NOT NULL
);

-- Run this query on db to insert sample data
-- INSERT INTO users(first_name, last_name, email, username, password_hash)
--  VALUES ('Sten', 'Laane', 'asd@asd.asd', 'SALaane', 'hash_of_password')