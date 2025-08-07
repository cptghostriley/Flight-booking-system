import { neon } from '@neondatabase/serverless';

// Create a singleton instance of the Neon client
// This prevents multiple connections from being created
const sql = neon(process.env.DATABASE_URL!);

export { sql };
