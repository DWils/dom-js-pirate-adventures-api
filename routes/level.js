const express = require('express');
const router = express.Router();
const Level = require('../models/Level'); // Ton modèle MongoDB

// Route GET /api/levels
router.get('/level', async (req, res) => {
    try {
        const levels = await Level.find();
        console.log(levels);
        res.json(levels);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/level/:level', async (req, res) => {
    const levelNumber = req.params.level;

    try {
        const level = await Level.findOne({ level: levelNumber });
        if (!level) {
            return res.status(404).json({ error: 'Niveau non trouvé' });
        }
        res.json(level);
    } catch (err) {
        console.error('Erreur lors de la récupération du niveau :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
