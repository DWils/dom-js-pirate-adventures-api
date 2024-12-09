// db.js
const { Pool } = require('pg');

// Créez une instance du pool de connexions PostgreSQL avec vos informations de connexion
const pool = new Pool({
    connectionString: process.env.SUPABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Cela dépend de votre configuration SSL
    },
});

module.exports = pool; // Exporter le pool pour pouvoir l'utiliser dans d'autres fichiers
