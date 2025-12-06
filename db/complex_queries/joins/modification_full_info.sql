SELECT
    -- Модификация
    M.id AS modification_id,
    M.name AS modification_name,
    -- Поколение
    G.id AS generation_id,
    G.name AS generation_name,
    G.start_year,
    -- Модель
    CM.id AS model_id,
    CM.name AS model_name,
    -- Производитель
    MF.id AS manufacturer_id,
    MF.name AS manufacturer_name,
    -- Двигатель
    E.id AS engine_id,
    E.type AS engine_type,
    E.configuration AS engine_configuration,
    E.power_kw,
    E.torque_nm,
    E.displacement,
    -- Трансмиссия
    T.id AS transmission_id,
    T.type AS transmission_type,
    T.gears_num,
    -- Кузов
    B.id AS body_id,
    B.type AS body_type
FROM
    MODIFICATION AS M
LEFT JOIN
    GENERATION AS G ON M.generation_id = G.id
LEFT JOIN
    CAR_MODEL AS CM ON G.car_model_id = CM.id
LEFT JOIN
    MANUFACTURER AS MF ON CM.manufacturer_id = MF.id
LEFT JOIN
    ENGINE AS E ON M.engine_id = E.id
LEFT JOIN
    TRANSMISSION AS T ON t.modification_id = m.id
LEFT JOIN
    BODY AS B ON M.body_id = B.id
WHERE
    M.id = $1;
