-- Поиск
SELECT name, 'Manufacturer' AS type 
FROM MANUFACTURER
WHERE name LIKE $1 
UNION
SELECT name, 'Model' AS type 
FROM CAR_MODEL
WHERE name LIKE $1
ORDER BY name;