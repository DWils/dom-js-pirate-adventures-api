BEGIN;

-- Table Item Model
CREATE TABLE item_model (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    class_name TEXT NOT NULL,
    image_path TEXT NOT NULL -- Chemin de l'image
);

-- Table Item
CREATE TABLE item (
    id SERIAL PRIMARY KEY,
    model_id INT NOT NULL REFERENCES item_model(id) ON DELETE CASCADE,
    unique_id TEXT NOT NULL -- Identifiant unique de l'instance
);

-- Table Level
CREATE TABLE level (
    id SERIAL PRIMARY KEY,
    instruction_subtitle TEXT NOT NULL,
    help_code TEXT NOT NULL,
    help_description TEXT NOT NULL,
    variable_name TEXT NOT NULL,
    answer_pattern TEXT NOT NULL,
    lesson TEXT NOT NULL
);

-- Table Item Level
CREATE TABLE item_level (
    id SERIAL PRIMARY KEY,
    level_id INT NOT NULL REFERENCES level(level_id) ON DELETE CASCADE,
    item_id INT NOT NULL REFERENCES item(id) ON DELETE CASCADE
);

-- Insertion dans Item Model
INSERT INTO item_model (name, class_name, image_path)
VALUES
('Bateau', 'bateau', 'pirate-ship.png'),
('Trésor', 'tresor', 'treasure.png');

-- Insertion dans Item
INSERT INTO item (model_id, unique_id)
VALUES
(1, 'bateau1'),
(1, 'bateau2'),
(1, 'bateau3'),
(2, 'tresor');

-- Insertion dans Level
INSERT INTO level (instruction_subtitle, help_code, help_description, variable_name, answer_pattern, lesson)
VALUES
('Sélectionner un élément avec son id', 'document.getElementById(''id_de_l''''élément'')', 'pour sélectionner le bateau !', 'bateau', '^(const|let|var)\\s+[a-zA-Z_$][a-zA-Z_$0-9]*\\s*=\\s*document\\.getElementById\\(["'']bateau1["'']\\);?$', 'La méthode getElementById() de l''interface Document renvoie un objet Element représentant l''élément dont la propriété id correspond à la chaîne de caractères spécifiée. Étant donné que les ID d''élément doivent être uniques, s''ils sont spécifiés, ils constituent un moyen utile d''accéder rapidement à un élément spécifique.'),
('Sélectionner plusieurs éléments avec leur classe', 'document.getElementsByClassName(''nom_de_la_classe'')', 'pour sélectionner tous les bateaux avec la même classe !', 'bateaux', '^(const|let|var)\\s+[a-zA-Z_$][a-zA-Z_$0-9]*\\s*=\\s*document\\.getElementsByClassName\\(["'']bateau["'']\\);?$', 'Renvoie un objet de type tableau de tous les éléments enfants qui ont tous les noms de classe donnés.'),
('Sélectionner le premier bateau avec querySelector', 'document.querySelector(''.nom_de_la_classe'')', 'pour sélectionner uniquement le premier bateau d''une classe !', 'bateau1', '^(const|let|var)\\s+[a-zA-Z_$][a-zA-Z_$0-9]*\\s*=\\s*document\\.querySelector\\(["'']\\.bateaux["'']\\);?$', 'La méthode querySelector() de l''interface Document retourne le premier Element dans le document correspondant au sélecteur.');


-- Insertion dans Item Level
INSERT INTO item_level (level_id, item_id) VALUES (1, 1);
INSERT INTO item_level (level_id, item_id) VALUES (2, 1), (2, 2), (2, 3);
INSERT INTO item_level (level_id, item_id) VALUES (3, 1), (3, 4), (3, 2);
--INSERT INTO item_level (level_id, item_id) VALUES (4, 1), (4, 2), (4, 3);


COMMIT;
