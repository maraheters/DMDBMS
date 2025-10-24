SELECT
    MF.name AS manufacturer_name,
    B.type AS body_type
FROM
    MANUFACTURER AS MF
CROSS JOIN
    BODY AS B
ORDER BY
    MF.name, B.type;