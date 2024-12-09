// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const levelRoutes = require('./routes/level'); // Importer les routes de niveau

const app = express();

// Configurer CORS
app.use(cors());

// Utiliser les routes de niveau
app.use('/api', levelRoutes); // Toutes les routes liées à /levels sont gérées par levelRoutes

// Démarrer le serveur
const port = 8080;
app.listen(port, () => {
    console.log(`Le serveur API écoute sur le port ${port}`);
});
