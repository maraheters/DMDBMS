SELECT 
    l.title,
    mod.name AS modification_name,
    l.price,
    ROUND(AVG(l.price) OVER (PARTITION BY cm.id), 2) AS avg_market_price_for_model,
    ROUND(((l.price - AVG(l.price) OVER (PARTITION BY cm.id)) / AVG(l.price) OVER (PARTITION BY cm.id)) * 100, 1) AS price_diff_percent
FROM LISTING l
JOIN MODIFICATION mod ON l.modification_id = mod.id
JOIN GENERATION g ON mod.generation_id = g.id
JOIN CAR_MODEL cm ON g.car_model_id = cm.id
WHERE l.price > 0;