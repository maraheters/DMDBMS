-- Поиск, к примеру
SELECT name, 'Manufacturer' AS type 
FROM MANUFACTURER
WHERE name LIKE 'B%' 
UNION
SELECT name, 'Model' AS type 
FROM CAR_MODEL
WHERE name LIKE 'B%'
ORDER BY name;