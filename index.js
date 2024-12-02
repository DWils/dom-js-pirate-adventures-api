const express = require('express');
const { Pool } = require('pg');
const app = express();

require('dotenv').config(); // Charger les variables d'environnement

const pool = new Pool({
  connectionString: process.env.SUPABASE_URL,
  ssl: { rejectUnauthorized: false }, // Nécessaire pour Supabase
});

app.use(express.json());

app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM votre_table');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur de connexion à la base de données' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Serveur en cours d'exécution sur le port ${port}`));
