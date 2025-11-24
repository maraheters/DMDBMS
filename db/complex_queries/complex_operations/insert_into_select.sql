INSERT INTO USER_ACTIVITY (user_id, action, details)
SELECT 
    l.user_id, 
    'POTENTIAL_VIP_OFFER', 
    CONCAT('User posted expensive listing id: ', l.id, ' with price: ', l.price)
FROM LISTING l
WHERE l.price > 10000000 
  AND l.created_at > NOW() - INTERVAL '1 day'
  AND NOT EXISTS (
      SELECT 1 FROM USER_ACTIVITY ua 
      WHERE ua.user_id = l.user_id 
      AND ua.action = 'POTENTIAL_VIP_OFFER'
      AND ua.timestamp > NOW() - INTERVAL '1 day'
  );