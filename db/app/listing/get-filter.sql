SELECT
    L.id,
    L.title,
    L.description,
    L.mileage,
    L.price,
    L.user_id,
    L.created_at,
    jsonb_build_object(
        'id', M.id,
        'name', M.name,
        'body', jsonb_build_object(
            'id', B.id,
            'type', B.type
        ),
        'engine', jsonb_build_object(
            'id', E.id,
            'type', E.type,
            'configuration', E.configuration,
            'power_kw', E.power_kw,
            'torque_nm', E.torque_nm,
            'displacement', E.displacement
        ),
        'transmission', jsonb_build_object(
            'id', T.id,
            'type', T.type,
            'gears_num', T.gears_num
        ),
        'generation', jsonb_build_object(
            'id', G.id,
            'name', G.name
        ),
        'car_model', jsonb_build_object(
            'id', CM.id,
            'name', CM.name
        ),
        'manufacturer', jsonb_build_object(
            'id', MF.id,
            'name', MF.name
        )
    ) AS modification,
    COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'id', I.id,
                'url', I.url,
                'order', I.order
            )
        ) FILTER (WHERE I.id IS NOT NULL),
    '[]'::jsonb
  ) AS images
FROM
    listing AS L
LEFT JOIN
    image AS I ON L.id = I.listing_id
LEFT JOIN
    modification AS M ON L.modification_id = M.id
LEFT JOIN
    engine AS E ON M.engine_id = E.id
LEFT JOIN
    transmission AS T ON M.id = T.modification_id
LEFT JOIN
    body AS B ON M.body_id = B.id
LEFT JOIN
    generation AS G ON M.generation_id = G.id
LEFT JOIN
    car_model AS CM ON G.car_model_id = CM.id
LEFT JOIN
    manufacturer AS MF ON CM.manufacturer_id = MF.id
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
    (L.mileage <= $9 OR $9 IS NULL)
ORDER BY L.created_at DESC
GROUP BY
  L.id, M.id, B.id, G.id, CM.id, MF.id, E.id, T.id;