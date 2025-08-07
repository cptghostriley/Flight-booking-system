const { neon } = require('@neondatabase/serverless');

async function setupNeonAuth() {
  console.log('Setting up Neon database for authentication...');
  
  try {
    // Database URL
    const databaseUrl = 'postgresql://neondb_owner:npg_p7OvZ5dIramn@ep-purple-art-a7viia03-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

    // Create connection
    const sql = neon(databaseUrl);

    // Create users table
    console.log('Creating users table...');
    await sql`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Create index on email
    console.log('Creating email index...');
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;

    // Insert demo user (password is 'demo123')
    console.log('Inserting demo user...');
    await sql`
      INSERT INTO users (name, email, password, created_at, updated_at) 
      VALUES (
          'Demo User', 
          'demo@skyBooker.com', 
          '$2a$10$8K1p/a0dQKKbWj6QFJKs4.qz4R8SXvI5VzQQN7DFklLiKQ8b7NvLq',
          NOW(),
          NOW()
      ) 
      ON CONFLICT (email) DO NOTHING
    `;

    // Verify setup
    const users = await sql`SELECT id, name, email, created_at FROM users LIMIT 5`;
    console.log('✅ Database setup complete!');
    console.log('Current users in database:', users);
    
    console.log('\n🎉 You can now login with:');
    console.log('Email: demo@skyBooker.com');
    console.log('Password: demo123');
    console.log('\nOr create a new account - it will be saved permanently!');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupNeonAuth();
