import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function testConnection() {
  try {
    const sql = neon(process.env.NEON_DATABASE_URL);
    const result = await sql`SELECT NOW() AS now`;
    console.log('Connection successful! Current time from DB:', result[0].now);
  } catch (error) {
    console.error('Failed to connect to Neon database:', error);
  }
}

testConnection(); 