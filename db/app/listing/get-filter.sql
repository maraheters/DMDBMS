SELECT
    L.id,
    L.title,
    L.price,
    M.id AS modification_id,
    M.name AS modification_name,
    MF.name AS manufacturer_name,
    B.type AS body_type,
    CM.name AS model_name
FROM
    LISTING AS L
LEFT JOIN
    MODIFICATION AS M ON L.modification_id = M.id
LEFT JOIN
    BODY AS B ON M.body_id = B.id
LEFT JOIN
    GENERATION AS G ON M.generation_id = G.id
LEFT JOIN
    CAR_MODEL AS CM ON G.car_model_id = CM.id
LEFT JOIN
    MANUFACTURER AS MF ON CM.manufacturer_id = MF.id
WHERE
    -- Фильтр по производителю
    (MF.id = $1 OR $1 IS NULL)
AND
    -- Фильтр по модели
    (CM.id = $2 OR $2 IS NULL)
AND
    -- Фильтр по поколению
    (G.id = $3 OR $3 IS NULL)
AND
    -- Фильтр по модификации
    (M.id = $4 OR $4 IS NULL)
AND
    -- Фильтр по типу кузова
    (B.id = $5 OR $5 IS NULL)
AND
    -- Фильтр по минимальной цене
    (L.price >= $6 OR $6 IS NULL)
AND
    -- Фильтр по максимальной цене
    (L.price <= $7 OR $7 IS NULL)
AND
    -- Фильтр по минимальному пробегу
    (L.mileage >= $8 OR $8 IS NULL)
AND
    -- Фильтр по максимальному пробегу
    (L.mileage <= $9 OR $9 IS NULL);