// routes/level.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // Importer la configuration de la base de données

// GET /levels - Récupérer tous les niveaux
router.get('/levels', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                level.id AS level_id,
                level.instruction_subtitle,
                level.help_code,
                level.help_description,
                level.variable_name,
                level.answer_pattern,
                level.lesson,
                json_agg(
                    json_build_object(
                        'id', item.id,
                        'class', item_model.class_name,
                        'image', item_model.image_path
                    )
                ) AS items
            FROM 
                level
            LEFT JOIN 
                item_level ON level.id = item_level.level_id
            LEFT JOIN 
                item ON item_level.item_id = item.id
            LEFT JOIN 
                item_model ON item.model_id = item_model.id
            GROUP BY 
                level.id;
        `);

        res.json(result.rows); // Envoi des niveaux et de leurs items associés
    } catch (err) {
        console.error('Error fetching levels:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /levels/:id - Récupérer un niveau par son ID
router.get('/levels/:id', async (req, res) => {
    const levelId = req.params.id;

    if (isNaN(levelId)) {
        return res.status(400).json({ error: 'ID de niveau invalide' });
    }

    try {
        const result = await pool.query(`
            SELECT 
                level.id AS level_id,
                level.instruction_subtitle,
                level.help_code,
                level.help_description,
                level.variable_name,
                level.answer_pattern,
                level.lesson,
                json_agg(
                    json_build_object(
                        'id', item.id,
                        'class', item_model.class,
                        'image', item_model.image
                    )
                ) AS items
            FROM 
                level
            LEFT JOIN 
                item_level ON level.id = item_level.level_id
            LEFT JOIN 
                item ON item_level.item_id = item.id
            LEFT JOIN 
                item_model ON item.item_model_id = item_model.id
            WHERE 
                level.id = $1
            GROUP BY 
                level.id;
        `, [levelId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Niveau non trouvé' });
        }

        res.json(result.rows[0]); // Envoi du niveau et de ses items associés
    } catch (err) {
        console.error('Error fetching level by ID:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
