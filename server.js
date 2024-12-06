// Charger les variables d'environnement depuis le fichier .env
require('dotenv').config();

const { Client } = require('pg');
const express = require('express');
const cors = require('cors');
const app = express();

// Configurer CORS
app.use(cors()); // Autorise toutes les origines

// Connexion à Supabase
const client = new Client({
    connectionString: process.env.SUPABASE_URL,
    ssl: { rejectUnauthorized: false },
});

// Fonction pour récupérer tous les niveaux avec leurs items associés
async function findLevels(req, res) {
    try {
        const query = `
        select level.id as level_id, name, item.id as item_id, item.item_id as item_unique_id, class as item_class, image as item_image from level
        inner join item_level on level.id = item_level.level_id
        inner join item on item.id = item_level.item_id
        inner join item_model on item_model.id = item.item_model_id;
    `;
        const result = await client.query(query);

        // Organiser les données par niveau
        const levels = result.rows.reduce((acc, row) => {
            const { level_id, level_name, item_id, item_unique_id, item_class, item_image } = row;

            let level = acc.find(l => l.id === level_id);
            if (!level) {
                level = { id: level_id, name: level_name, items: [] };
                acc.push(level);
            }

            if (item_id) {
                level.items.push({
                    id: item_id,
                    item_id: item_unique_id,
                    class: item_class,
                    image: item_image,
                });
            }

            return acc;
        }, []);

        res.json(levels);
    } catch (err) {
        console.error('Erreur lors de la récupération des niveaux et de leurs items:', err);
        res.status(500).send('Erreur lors de la récupération des niveaux et de leurs items');
    }
}

// Fonction pour récupérer un niveau par ID avec ses items associés
async function findLevelById(req, res) {
    const levelId = req.params.id;
    try {
        const query = `
      SELECT 
        level.id AS level_id, 
        level.name AS level_name, 
        item.id AS item_id, 
        item.item_id AS item_unique_id, 
        item_model.class AS item_class, 
        item_model.image AS item_image
      FROM level
      LEFT JOIN item_level ON level.id = item_level.level_id
      LEFT JOIN item ON item_level.item_id = item.id
      LEFT JOIN item_model ON item.item_model_id = item_model.id
      WHERE level.id = $1;
    `;
        const result = await client.query(query, [levelId]);

        if (result.rows.length === 0) {
            res.status(404).send('Niveau non trouvé');
        } else {
            // Organiser les données par niveau
            const level = result.rows.reduce((acc, row) => {
                const { level_id, level_name, item_id, item_unique_id, item_class, item_image } = row;

                if (!acc) {
                    acc = { id: level_id, name: level_name, items: [] };
                }

                if (item_id) {
                    acc.items.push({
                        id: item_id,
                        unique_id: item_unique_id,
                        class: item_class,
                        image: item_image,
                    });
                }

                return acc;
            }, null);

            res.json(level);
        }
    } catch (err) {
        console.error('Erreur lors de la récupération du niveau et de ses items:', err);
        res.status(500).send('Erreur lors de la récupération du niveau et de ses items');
    }
}

// Connexion à la base de données
client.connect()
    .then(() => console.log('Connecté à Supabase'))
    .catch((err) => console.error('Erreur lors de la connexion à Supabase:', err));

// Configuration du serveur Express
const port = 3000;

// Route pour récupérer tous les niveaux avec leurs items associés
app.get('/levels', findLevels);

// Route pour récupérer un niveau par ID avec ses items associés
app.get('/level/:id', findLevelById);

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Le serveur API écoute sur le port ${port}`);
});
