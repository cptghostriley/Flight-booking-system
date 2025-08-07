import { sql } from '../lib/db.ts'; // Adjust path as needed
import fs from 'fs';
import path from 'path';

const sqlFiles = [
  'create-database.sql',
  'seed-airports.sql',
  'seed-airlines.sql'
];

async function runSetup() {
  console.log('Starting Neon database setup...');
  for (const file of sqlFiles) {
    const filePath = path.join(process.cwd(), 'scripts', file);
    try {
      const query = fs.readFileSync(filePath, 'utf8');
      await sql.query(query);
      console.log(`✅ Successfully executed ${file}`);
    } catch (e) {
      console.error(`❌ Error executing ${file}:`, e);
      // If a critical script fails, you might want to stop
      // throw e;
    }
  }
  console.log('Neon database setup complete.');
}

runSetup().catch(console.error);
