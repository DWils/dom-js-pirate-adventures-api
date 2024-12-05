require('dotenv').config();
const { Client } = require('pg');

// Configuration du client
const client = new Client({
  connectionString: process.env.SUPABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Données à insérer
const data = [
  {
    level: 1,
    items: [
      {
        id: "bateau1",
        class: "bateau",
        image: "/assets/images/pirate-ship.png",
      },
    ],
  },
  {
    level: 2,
    items: [
      {
        id: "bateau1",
        class: "bateau",
        image: "/assets/images/pirate-ship.png",
      },
      {
        id: "bateau2",
        class: "bateau",
        image: "/assets/images/pirate-ship.png",
      },
      {
        id: "bateau3",
        class: "bateau",
        image: "/assets/images/pirate-ship.png",
      },
    ],
  },
  {
    level: 3,
    items: [
      {
        id: "bateau1",
        class: "bateau",
        image: "/assets/images/pirate-ship.png",
      },
      {
        id: "tresor",
        class: "tresor",
        image: "/assets/images/treasure.png",
      },
      {
        id: "bateau2",
        class: "bateau",
        image: "/assets/images/pirate-ship.png",
      },
    ],
  },
  {
    level: 4,
    items: [
      {
        id: "bateau1",
        class: "bateau",
        image: "/assets/images/pirate-ship.png",
      },
      {
        id: "bateau2",
        class: "bateau",
        image: "/assets/images/pirate-ship.png",
      },
      {
        id: "bateau3",
        class: "bateau",
        image: "/assets/images/pirate-ship.png",
      },
    ],
  },
];

async function insertData() {
  try {
    // Connexion à la base de données
    await client.connect();

    for (const entry of data) {
      // Insérer le niveau
      const levelResult = await client.query(
        `INSERT INTO level (name) VALUES ($1) RETURNING id;`,
        [`Niveau ${entry.level}`]
      );
      const levelId = levelResult.rows[0].id;

      for (const item of entry.items) {
        // Vérifier si le modèle d'item existe déjà
        const modelResult = await client.query(
          `SELECT id FROM item_model WHERE class = $1 AND image = $2;`,
          [item.class, item.image]
        );

        let itemModelId;
        if (modelResult.rows.length > 0) {
          // Si le modèle existe, récupérer l'ID
          itemModelId = modelResult.rows[0].id;
        } else {
          // Sinon, insérer le nouveau modèle et récupérer l'ID
          const newModelResult = await client.query(
            `INSERT INTO item_model (class, image) VALUES ($1, $2) RETURNING id;`,
            [item.class, item.image]
          );
          itemModelId = newModelResult.rows[0].id;
        }

        // Insérer l'item avec son modèle
        const itemResult = await client.query(
          `INSERT INTO item (item_id, item_model_id) VALUES ($1, $2) RETURNING id;`,
          [item.id, itemModelId]
        );
        const itemId = itemResult.rows[0].id;

        // Insérer la relation entre le niveau et l'item
        await client.query(
          `INSERT INTO item_level (level_id, item_id) VALUES ($1, $2);`,
          [levelId, itemId]
        );
      }
    }

    console.log("Données insérées avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'insertion des données :", error);
  } finally {
    // Déconnexion après l'exécution
    await client.end();
  }
}

// Appeler la fonction pour insérer les données
insertData();
