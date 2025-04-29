-- Création de la base de données
CREATE DATABASE IF NOT EXISTS noteflex;
USE noteflex;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  reset_token VARCHAR(255),
  reset_token_expires DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des notes
CREATE TABLE IF NOT EXISTS notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  elements TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Données de test
-- Utilisateurs (mot de passe: password123)
INSERT INTO users (name, email, password) VALUES
('Jean Dupont', 'jean@example.com', '$2a$10$XFE/oW.ZOI.Zd1vMCLs9gu8KaWnzrn.C5XmCeaJIQHhvN0BmYzHSO'),
('Marie Martin', 'marie@example.com', '$2a$10$XFE/oW.ZOI.Zd1vMCLs9gu8KaWnzrn.C5XmCeaJIQHhvN0BmYzHSO');

-- Notes
INSERT INTO notes (user_id, title, elements) VALUES
(1, 'Idées de projet', '[{"id":"1","type":"text","content":"Développer une application de prise de notes avec canevas interactif","position":{"x":50,"y":50},"style":{"fontWeight":"bold","fontStyle":"normal","fontSize":18,"color":"#000000"}}]'),
(1, 'Liste de courses', '[{"id":"1","type":"text","content":"- Pain\\n- Lait\\n- Œufs\\n- Fromage","position":{"x":50,"y":50},"style":{"fontWeight":"normal","fontStyle":"normal","fontSize":16,"color":"#000000"}}]'),
(1, 'Recette de gâteau', '[{"id":"1","type":"text","content":"Ingrédients:\\n- 200g de farine\\n- 150g de sucre\\n- 3 œufs\\n- 100g de beurre","position":{"x":50,"y":50},"style":{"fontWeight":"normal","fontStyle":"normal","fontSize":16,"color":"#000000"}},{"id":"2","type":"image","src":"https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1089&q=80","position":{"x":50,"y":200},"size":{"width":300,"height":200}}]'),
(2, 'Réunion du 15 mai', '[{"id":"1","type":"text","content":"Points à aborder:\\n1. Présentation du projet\\n2. Planning\\n3. Budget","position":{"x":50,"y":50},"style":{"fontWeight":"normal","fontStyle":"normal","fontSize":16,"color":"#000000"}}]'),
(2, 'Tutoriel React', '[{"id":"1","type":"text","content":"Apprendre React en 2023","position":{"x":50,"y":50},"style":{"fontWeight":"bold","fontStyle":"normal","fontSize":20,"color":"#000000"}},{"id":"2","type":"link","url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ","position":{"x":50,"y":100}}]');
