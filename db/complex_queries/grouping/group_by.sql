SELECT 
    m.name AS manufacturer_name,
    COUNT(l.id) AS total_listings,
    ROUND(AVG(l.price), 2) AS avg_price,
    ROUND(AVG(l.mileage), 0) AS avg_mileage
FROM LISTING l
JOIN MODIFICATION mod ON l.modification_id = mod.id
JOIN GENERATION g ON mod.generation_id = g.id
JOIN CAR_MODEL cm ON g.car_model_id = cm.id
JOIN MANUFACTURER m ON cm.manufacturer_id = m.id
GROUP BY m.name
ORDER BY total_listings DESC;