require('dotenv').config();
const { Client } = require('pg');

// Récupérer les variables d'environnement
const client = new Client({
  connectionString: process.env.SUPABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function createTables() {
  try {
    // Connexion à la base de données
    await client.connect();

    // SQL pour créer les tables
    const queries = [
      `
      CREATE TABLE IF NOT EXISTS level (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
      `,
      `
      CREATE TABLE IF NOT EXISTS item_model (
        id SERIAL PRIMARY KEY,
        class VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL
      );
      `,
      `
      CREATE TABLE IF NOT EXISTS item (
        id SERIAL PRIMARY KEY,
        item_id VARCHAR(255) NOT NULL,
        item_model_id INTEGER REFERENCES item_model(id) ON DELETE CASCADE
      );
      `,
      `
      CREATE TABLE IF NOT EXISTS item_level (
        id SERIAL PRIMARY KEY,
        level_id INTEGER REFERENCES level(id) ON DELETE CASCADE,
        item_id INTEGER REFERENCES item(id) ON DELETE CASCADE
      );
      `,
    ];

    // Exécution des requêtes pour créer les tables
    for (const query of queries) {
      await client.query(query);
      console.log('Table créée ou déjà existante.');
    }
  } catch (error) {
    console.error('Erreur lors de la création des tables :', error);
  } finally {
    // Déconnexion après l'exécution
    await client.end();
  }
}

createTables();
