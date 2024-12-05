const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.SUPABASE_URL,
  ssl: { rejectUnauthorized: false }, // Nécessaire pour certaines bases Supabase
});

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Connexion réussie !', result.rows[0]);
  } catch (error) {
    console.error('Erreur de connexion :', error);
  } finally {
    pool.end();
  }
}

testConnection();
