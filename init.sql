-- Create database
CREATE DATABASE IF NOT EXISTS bonchai;
USE bonchai;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create trees table
CREATE TABLE IF NOT EXISTS trees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    scientific_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    care TEXT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tree_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_favorite (user_id, tree_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tree_id) REFERENCES trees(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample trees
INSERT INTO trees (name, scientific_name, description, care, image_url) VALUES
('Oak Tree', 'Quercus robur', 'The Oak Tree is a majestic and long-lived deciduous tree known for its strong wood and beautiful foliage. It provides excellent shade and is a symbol of strength and endurance. Oak trees can grow in various climates and are commonly found in temperate regions.', 'Planting: Plant in well-draining soil with spacing of 3-5 meters between trees.\n\nCare: Water 2-3 times per week. Apply organic fertilizer every 3 months. Prune during summer months.\n\nSunlight: Requires full sun or partial shade.\n\nWater: Water when soil is dry, but avoid overwatering.', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=600&fit=crop'),
('Magnolia', 'Magnolia grandiflora', 'Magnolia is a beautiful flowering tree known for its large, fragrant white or pink flowers. It is a popular ornamental tree in gardens and public spaces, valued for its elegant appearance and pleasant fragrance.', 'Planting: Plant in loamy, well-drained soil with spacing of 2-4 meters.\n\nCare: Water daily during the first year, then 2-3 times per week. Fertilize every 2 months.\n\nSunlight: Requires full sun.\n\nWater: Needs moderate watering. Avoid waterlogging.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'),
('Maple Tree', 'Acer saccharum', 'The Maple Tree is a large shade tree with vibrant fall colors. It is perfect for wide open spaces and has a strong root system that can withstand strong winds. Maples are known for their beautiful autumn foliage.', 'Planting: Plant in deep soil with wide space, minimum spacing of 5-7 meters.\n\nCare: Water 1-2 times per week. Fertilize twice a year. Prune dead branches.\n\nSunlight: Requires full sun.\n\nWater: Drought tolerant, but water regularly during the first few years.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'),
('Apple Tree', 'Malus domestica', 'The Apple Tree is a fruit-bearing tree that produces delicious fruits. It has dark green leaves and beautiful blossoms in spring. Popular in orchards and agricultural areas for its fruit production.', 'Planting: Plant in fertile, well-draining soil with spacing of 4-6 meters.\n\nCare: Water 3-4 times per week. Fertilize monthly during growing season. Apply pest control as needed.\n\nSunlight: Requires full sun.\n\nWater: Needs consistent watering, especially during fruit development.', 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=600&fit=crop'),
('Fiddle Leaf Fig', 'Ficus lyrata', 'The Fiddle Leaf Fig is an ornamental plant with beautiful light green leaves. Perfect for container planting or small gardens. It has slow but steady growth and is popular as an indoor plant.', 'Planting: Plant in well-draining potting mix. Use medium to large containers.\n\nCare: Water every 2-3 days. Apply liquid fertilizer every 2 weeks. Repot annually.\n\nSunlight: Requires partial sun or filtered light.\n\nWater: Needs consistent moisture, but avoid overwatering.', 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800&h=600&fit=crop'),
('Pine Tree', 'Pinus sylvestris', 'The Pine Tree is a hardy evergreen tree that can withstand harsh environmental conditions. It has thick, strong needles and is perfect for windy or dry areas. Pines are known for their resilience and longevity.', 'Planting: Plant in well-draining soil with spacing of 3-4 meters.\n\nCare: Water 1-2 times per week. Fertilize every 4 months. Prune once a year.\n\nSunlight: Requires full sun.\n\nWater: Very drought tolerant. Water when soil is completely dry.', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=600&fit=crop'),
('Japanese Maple', 'Acer palmatum', 'The Japanese Maple is an ornamental tree with beautiful form and dark green leaves that turn vibrant colors in autumn. Popular in garden design and landscaping. It has moderate growth rate.', 'Planting: Plant in loamy, moist soil with spacing of 2-3 meters.\n\nCare: Water 2-3 times per week. Fertilize every 3 months. Prune to maintain shape.\n\nSunlight: Requires partial to full sun.\n\nWater: Needs moderate watering. Avoid waterlogging.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'),
('Cherry Tree', 'Prunus avium', 'The Cherry Tree is a fast-growing fruit tree that produces delicious fruits. It has bright green leaves and beautiful blossoms in spring. Popular in orchards for its early fruit production and excellent taste.', 'Planting: Plant in fertile soil with spacing of 3-5 meters.\n\nCare: Water 3-4 times per week. Fertilize monthly. Maintain pruning for good fruit production.\n\nSunlight: Requires full sun.\n\nWater: Needs consistent watering, especially during flowering and fruiting periods.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'),
('Redwood Tree', 'Sequoia sempervirens', 'The Redwood Tree is a majestic large tree known for its impressive height and longevity. It provides excellent shade and can live for thousands of years. Perfect for public spaces and large gardens.', 'Planting: Plant in deep soil with wide space, minimum spacing of 6-8 meters.\n\nCare: Water 1-2 times per week. Fertilize twice a year. Prune dead and interfering branches.\n\nSunlight: Requires full sun.\n\nWater: Drought tolerant, but water regularly during the first 2-3 years.', 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=600&fit=crop');

