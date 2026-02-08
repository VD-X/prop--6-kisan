import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.argv[2];

if (!connectionString) {
  console.error('Please provide the connection string as an argument.');
  console.error('Usage: node setup_db.js "postgresql://..."');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function setup() {
  try {
    await client.connect();
    console.log('Connected to database...');

    const sqlPath = path.join(__dirname, 'supabase_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Running schema...');
    await client.query(sql);
    
    console.log('✅ Database setup complete! Tables created successfully.');
  } catch (err) {
    console.error('❌ Error executing schema:', err);
  } finally {
    await client.end();
  }
}

setup();
