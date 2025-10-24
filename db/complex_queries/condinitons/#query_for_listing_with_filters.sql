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
    (MF.id = :manufacturer_id OR :manufacturer_id IS NULL)
AND
    -- Фильтр по модели
    (CM.id = :model_id OR :model_id IS NULL)
AND
    -- Фильтр по поколению
    (G.id = :generation_id OR :generation_id IS NULL)
AND
    -- Фильтр по модификации
    (M.id = :modification_id OR :modification_id IS NULL)
AND
    -- Фильтр по типу кузова
    (B.id = :body_id OR :body_id IS NULL)
AND
    -- Фильтр по минимальной цене
    (L.price >= :min_price OR :min_price IS NULL)
AND
    -- Фильтр по максимальной цене
    (L.price <= :max_price OR :max_price IS NULL)
AND
    -- Фильтр по минимальному пробегу
    (L.mileage <= :min_mileage OR :min_mileage IS NULL)
AND
    -- Фильтр по максимальному пробегу
    (L.mileage <= :max_mileage OR :max_mileage IS NULL);