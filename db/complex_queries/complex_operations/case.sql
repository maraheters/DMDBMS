SELECT 
    l.title,
    e.power_kw,
    e.type AS engine_type,
    CASE 
        WHEN e.type = 'Electric' THEN 'Eco-Friendly'
        WHEN e.power_kw > 250 THEN 'Supercar'
        WHEN e.power_kw > 150 THEN 'Sport'
        WHEN e.displacement < 1.6 AND e.type != 'Electric' THEN 'City Car'
        ELSE 'Standard'
    END AS car_category
FROM LISTING l
JOIN MODIFICATION mod ON l.modification_id = mod.id
JOIN ENGINE e ON mod.engine_id = e.id;
