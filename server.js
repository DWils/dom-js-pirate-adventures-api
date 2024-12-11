require('dotenv').config(); // Charger les variables d'environnement
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const levelRoutes = require('./routes/level'); // Import des routes des niveaux

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connecté à MongoDB'))
    .catch((err) => console.error('Erreur de connexion à MongoDB :', err));

// Routes
app.use('/api', levelRoutes);

// Configuration du serveur
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});
