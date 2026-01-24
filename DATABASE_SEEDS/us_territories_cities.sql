-- ============================================
-- US INHABITED TERRITORIES CITIES SEEDER
-- ============================================
-- This file contains cities for the 5 US inhabited territories
-- To be imported into the cities table
-- 
-- Prerequisites:
-- 1. States/territories must exist with these exact names:
--    - American Samoa
--    - Guam
--    - Northern Mariana Islands
--    - Puerto Rico
--    - U.S. Virgin Islands
--
-- Usage:
-- Execute this SQL file in your database after ensuring territories exist
-- ============================================

-- ============================================
-- AMERICAN SAMOA CITIES
-- ============================================
-- American Samoa has 5 districts, each considered a city/village area

INSERT INTO cities (state_id, name, created_at, updated_at)
SELECT id, 'Pago Pago', NOW(), NOW() FROM states WHERE name = 'American Samoa'
UNION ALL
SELECT id, 'Tafuna', NOW(), NOW() FROM states WHERE name = 'American Samoa'
UNION ALL
SELECT id, 'Leone', NOW(), NOW() FROM states WHERE name = 'American Samoa'
UNION ALL
SELECT id, 'Fagatogo', NOW(), NOW() FROM states WHERE name = 'American Samoa'
UNION ALL
SELECT id, 'Vaitogi', NOW(), NOW() FROM states WHERE name = 'American Samoa'
UNION ALL
SELECT id, 'Vailoatai', NOW(), NOW() FROM states WHERE name = 'American Samoa'
UNION ALL
SELECT id, 'Vatia', NOW(), NOW() FROM states WHERE name = 'American Samoa'
UNION ALL
SELECT id, 'Aasu', NOW(), NOW() FROM states WHERE name = 'American Samoa'
UNION ALL
SELECT id, 'Ili''ili', NOW(), NOW() FROM states WHERE name = 'American Samoa'
UNION ALL
SELECT id, 'Malaeloa', NOW(), NOW() FROM states WHERE name = 'American Samoa'
UNION ALL
SELECT id, 'Aua', NOW(), NOW() FROM states WHERE name = 'American Samoa'
UNION ALL
SELECT id, 'Nu''uuli', NOW(), NOW() FROM states WHERE name = 'American Samoa'
UNION ALL
SELECT id, 'Mapusaga', NOW(), NOW() FROM states WHERE name = 'American Samoa'
UNION ALL
SELECT id, 'Fagasa', NOW(), NOW() FROM states WHERE name = 'American Samoa'
UNION ALL
SELECT id, 'Amouli', NOW(), NOW() FROM states WHERE name = 'American Samoa';

-- ============================================
-- GUAM CITIES/VILLAGES
-- ============================================
-- Guam has 19 villages

INSERT INTO cities (state_id, name, created_at, updated_at)
SELECT id, 'Hagåtña (Agana)', NOW(), NOW() FROM states WHERE name = 'Guam'
UNION ALL
SELECT id, 'Dededo', NOW(), NOW() FROM states WHERE name = 'Guam'
UNION ALL
SELECT id, 'Tamuning', NOW(), NOW() FROM states WHERE name = 'Guam'
UNION ALL
SELECT id, 'Mangilao', NOW(), NOW() FROM states WHERE name = 'Guam'
UNION ALL
SELECT id, 'Yigo', NOW(), NOW() FROM states WHERE name = 'Guam'
UNION ALL
SELECT id, 'Barrigada', NOW(), NOW() FROM states WHERE name = 'Guam'
UNION ALL
SELECT id, 'Yona', NOW(), NOW() FROM states WHERE name = 'Guam'
UNION ALL
SELECT id, 'Santa Rita', NOW(), NOW() FROM states WHERE name = 'Guam'
UNION ALL
SELECT id, 'Sinajana', NOW(), NOW() FROM states WHERE name = 'Guam'
UNION ALL
SELECT id, 'Mongmong-Toto-Maite', NOW(), NOW() FROM states WHERE name = 'Guam'
UNION ALL
SELECT id, 'Chalan Pago-Ordot', NOW(), NOW() FROM states WHERE name = 'Guam'
UNION ALL
SELECT id, 'Talofofo', NOW(), NOW() FROM states WHERE name = 'Guam'
UNION ALL
SELECT id, 'Inarajan', NOW(), NOW() FROM states WHERE name = 'Guam'
UNION ALL
SELECT id, 'Merizo', NOW(), NOW() FROM states WHERE name = 'Guam'
UNION ALL
SELECT id, 'Asan-Maina', NOW(), NOW() FROM states WHERE name = 'Guam'
UNION ALL
SELECT id, 'Piti', NOW(), NOW() FROM states WHERE name = 'Guam'
UNION ALL
SELECT id, 'Agat', NOW(), NOW() FROM states WHERE name = 'Guam'
UNION ALL
SELECT id, 'Umatac', NOW(), NOW() FROM states WHERE name = 'Guam'
UNION ALL
SELECT id, 'Tumon', NOW(), NOW() FROM states WHERE name = 'Guam';

-- ============================================
-- NORTHERN MARIANA ISLANDS CITIES/VILLAGES
-- ============================================
-- Northern Mariana Islands has major population centers

INSERT INTO cities (state_id, name, created_at, updated_at)
SELECT id, 'Saipan', NOW(), NOW() FROM states WHERE name = 'Northern Mariana Islands'
UNION ALL
SELECT id, 'Tinian', NOW(), NOW() FROM states WHERE name = 'Northern Mariana Islands'
UNION ALL
SELECT id, 'Rota', NOW(), NOW() FROM states WHERE name = 'Northern Mariana Islands'
UNION ALL
SELECT id, 'Garapan', NOW(), NOW() FROM states WHERE name = 'Northern Mariana Islands'
UNION ALL
SELECT id, 'Susupe', NOW(), NOW() FROM states WHERE name = 'Northern Mariana Islands'
UNION ALL
SELECT id, 'San Jose', NOW(), NOW() FROM states WHERE name = 'Northern Mariana Islands'
UNION ALL
SELECT id, 'Chalan Kanoa', NOW(), NOW() FROM states WHERE name = 'Northern Mariana Islands'
UNION ALL
SELECT id, 'San Antonio', NOW(), NOW() FROM states WHERE name = 'Northern Mariana Islands'
UNION ALL
SELECT id, 'Kagman', NOW(), NOW() FROM states WHERE name = 'Northern Mariana Islands'
UNION ALL
SELECT id, 'Capitol Hill', NOW(), NOW() FROM states WHERE name = 'Northern Mariana Islands'
UNION ALL
SELECT id, 'Koblerville', NOW(), NOW() FROM states WHERE name = 'Northern Mariana Islands'
UNION ALL
SELECT id, 'San Roque', NOW(), NOW() FROM states WHERE name = 'Northern Mariana Islands'
UNION ALL
SELECT id, 'San Vicente', NOW(), NOW() FROM states WHERE name = 'Northern Mariana Islands';

-- ============================================
-- PUERTO RICO CITIES/MUNICIPALITIES
-- ============================================
-- Puerto Rico has 78 municipalities - listing all major ones

INSERT INTO cities (state_id, name, created_at, updated_at)
SELECT id, 'San Juan', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Bayamón', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Carolina', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Ponce', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Caguas', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Guaynabo', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Mayagüez', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Trujillo Alto', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Arecibo', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Toa Baja', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Toa Alta', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Aguadilla', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Cayey', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Humacao', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Vega Baja', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Manatí', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Fajardo', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Yauco', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Guayama', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Canóvanas', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Río Grande', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Juana Díaz', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Dorado', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Gurabo', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Isabela', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Aibonito', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Coamo', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Hatillo', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Yabucoa', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Corozal', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Salinas', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Vega Alta', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Añasco', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Barceloneta', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Cidra', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Naranjito', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Aguas Buenas', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Camuy', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'San Germán', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Cabo Rojo', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Hormigueros', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'San Sebastián', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Las Piedras', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Juncos', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Luquillo', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Ceiba', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Naguabo', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Loíza', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Cataño', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Santa Isabel', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Utuado', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Lares', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Adjuntas', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Rincón', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Lajas', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Moca', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Quebradillas', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Peñuelas', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Arroyo', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Maunabo', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Patillas', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Guánica', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Villalba', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Orocovis', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Barranquitas', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Comerío', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Morovis', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Ciales', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Florida', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Jayuya', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Maricao', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Las Marías', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Vieques', NOW(), NOW() FROM states WHERE name = 'Puerto Rico'
UNION ALL
SELECT id, 'Culebra', NOW(), NOW() FROM states WHERE name = 'Puerto Rico';

-- ============================================
-- U.S. VIRGIN ISLANDS CITIES/DISTRICTS
-- ============================================
-- USVI has 3 main islands with multiple districts/towns

-- St. Croix
INSERT INTO cities (state_id, name, created_at, updated_at)
SELECT id, 'Christiansted', NOW(), NOW() FROM states WHERE name = 'U.S. Virgin Islands'
UNION ALL
SELECT id, 'Frederiksted', NOW(), NOW() FROM states WHERE name = 'U.S. Virgin Islands'
UNION ALL
SELECT id, 'Anna''s Hope Village', NOW(), NOW() FROM states WHERE name = 'U.S. Virgin Islands'
UNION ALL
SELECT id, 'Kingshill', NOW(), NOW() FROM states WHERE name = 'U.S. Virgin Islands'
UNION ALL
SELECT id, 'Sion Farm', NOW(), NOW() FROM states WHERE name = 'U.S. Virgin Islands'
UNION ALL
SELECT id, 'Sunny Isle', NOW(), NOW() FROM states WHERE name = 'U.S. Virgin Islands'
UNION ALL
SELECT id, 'La Grande Princesse', NOW(), NOW() FROM states WHERE name = 'U.S. Virgin Islands'
UNION ALL
SELECT id, 'Estate Whim', NOW(), NOW() FROM states WHERE name = 'U.S. Virgin Islands'

-- St. Thomas
UNION ALL
SELECT id, 'Charlotte Amalie', NOW(), NOW() FROM states WHERE name = 'U.S. Virgin Islands'
UNION ALL
SELECT id, 'Red Hook', NOW(), NOW() FROM states WHERE name = 'U.S. Virgin Islands'
UNION ALL
SELECT id, 'Smith Bay', NOW(), NOW() FROM states WHERE name = 'U.S. Virgin Islands'
UNION ALL
SELECT id, 'Tutu', NOW(), NOW() FROM states WHERE name = 'U.S. Virgin Islands'
UNION ALL
SELECT id, 'Havensight', NOW(), NOW() FROM states WHERE name = 'U.S. Virgin Islands'
UNION ALL
SELECT id, 'Frenchtown', NOW(), NOW() FROM states WHERE name = 'U.S. Virgin Islands'
UNION ALL
SELECT id, 'Estate Thomas', NOW(), NOW() FROM states WHERE name = 'U.S. Virgin Islands'
UNION ALL
SELECT id, 'Bovoni', NOW(), NOW() FROM states WHERE name = 'U.S. Virgin Islands'

-- St. John
UNION ALL
SELECT id, 'Cruz Bay', NOW(), NOW() FROM states WHERE name = 'U.S. Virgin Islands'
UNION ALL
SELECT id, 'Coral Bay', NOW(), NOW() FROM states WHERE name = 'U.S. Virgin Islands';

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to verify all cities were inserted correctly:
/*
SELECT 
    s.name AS territory,
    COUNT(c.id) AS city_count
FROM states s
LEFT JOIN cities c ON c.state_id = s.id
WHERE s.name IN (
    'American Samoa',
    'Guam',
    'Northern Mariana Islands',
    'Puerto Rico',
    'U.S. Virgin Islands'
)
GROUP BY s.name
ORDER BY s.name;

Expected Results:
- American Samoa: 15 cities
- Guam: 19 cities
- Northern Mariana Islands: 13 cities
- Puerto Rico: 72 cities
- U.S. Virgin Islands: 18 cities
TOTAL: 137 cities
*/

-- ============================================
-- CLEANUP (if needed)
-- ============================================
-- To remove all territory cities (USE WITH CAUTION):
/*
DELETE FROM cities 
WHERE state_id IN (
    SELECT id FROM states 
    WHERE name IN (
        'American Samoa',
        'Guam',
        'Northern Mariana Islands',
        'Puerto Rico',
        'U.S. Virgin Islands'
    )
);
*/
