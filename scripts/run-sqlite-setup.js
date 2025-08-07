import { db } from '../lib/db.ts'; // Adjust path as needed
import fs from 'fs';
import path from 'path';

const sqlFiles = [
  'create-database.sql',
  'seed-airports.sql',
  'seed-airlines.sql'
];

console.log('Starting SQLite database setup...');

sqlFiles.forEach(file => {
  const filePath = path.join(process.cwd(), 'scripts', file);
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    db.exec(sql);
    console.log(`✅ Successfully executed ${file}`);
  } catch (e) {
    console.error(`❌ Error executing ${file}:`, e);
    // Optionally, re-throw the error to stop execution if a critical script fails
    // throw e;
  }
});

db.close();
console.log('SQLite database setup complete. Database connection closed.');
