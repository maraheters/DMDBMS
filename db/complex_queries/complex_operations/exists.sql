SELECT c.name AS country_name
FROM COUNTRY c
WHERE EXISTS (
    SELECT 1
    FROM MANUFACTURER m
    JOIN CAR_MODEL cm ON m.id = cm.manufacturer_id
    JOIN GENERATION g ON cm.id = g.car_model_id
    JOIN MODIFICATION mod ON g.id = mod.generation_id
    JOIN LISTING l ON mod.id = l.modification_id
    WHERE m.country_id = c.id
);