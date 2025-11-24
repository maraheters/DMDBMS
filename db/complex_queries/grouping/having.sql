-- Сценарий: Поиск потенциальных перекупщиков или автосалонов среди пользователей. 

SELECT 
    u.name AS user_name,
    u.email,
    COUNT(l.id) AS active_listings_count,
    SUM(l.price) AS total_inventory_value
FROM "USER" u
JOIN LISTING l ON u.id = l.user_id
GROUP BY u.id, u.name, u.email
HAVING COUNT(l.id) > 3 AND SUM(l.price) > 1_000_000
ORDER BY total_inventory_value DESC;