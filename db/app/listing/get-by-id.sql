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
    (
        SELECT COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'id', I.id,
                    'url', I.url,
                    'order', I.order
                ) ORDER BY I.order ASC
            ),
            '[]'::jsonb
        )
        FROM image I
        WHERE I.listing_id = L.id
    ) AS images,
    (
        SELECT COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'id', D.id,
                    'url', D.url
                )
            ),
            '[]'::jsonb
        )
        FROM document D
        WHERE D.listing_id = L.id
    ) AS documents
FROM
    listing AS L
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
    L.id = $1;

