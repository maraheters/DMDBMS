EXPLAIN ANALYZE
SELECT l.title, l.price, l.mileage, t.type
FROM LISTING l
JOIN MODIFICATION mod ON l.modification_id = mod.id
JOIN TRANSMISSION t ON mod.id = t.modification_id
WHERE 
    l.price BETWEEN 10000 AND 50000
    AND l.mileage < 100000
    AND t.type = 'Automatic'
ORDER BY l.created_at DESC;
