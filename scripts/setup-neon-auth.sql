-- Create users table for Neon database
-- This will store user authentication data persistently

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert a demo user for testing (password is 'demo123')
INSERT INTO users (name, email, password, created_at, updated_at) 
VALUES (
    'Demo User', 
    'demo@skyBooker.com', 
    '$2a$10$8K1p/a0dQKKbWj6QFJKs4.qz4R8SXvI5VzQQN7DFklLiKQ8b7NvLq',
    NOW(),
    NOW()
) 
ON CONFLICT (email) DO NOTHING;

-- Verify the table was created
SELECT 'Users table created successfully' as status;
