-- Create (with FKs to USER and MODIFICATION)
INSERT INTO LISTING (title, description, mileage, price, user_id, modification_id, created_at)
SELECT 'Megane TCe 140', 'One owner, good condition', 42000, 14500.00, 1, m.id, CURRENT_TIMESTAMP
FROM MODIFICATION m
WHERE m.name = 'TCe 140'
RETURNING *;

-- Read (by id, with joins)
SELECT l.id, l.title, l.price, l.mileage, l.created_at,
       u.email AS author_email,
       m.name AS modification_name
FROM LISTING l
JOIN "USER" u ON u.id = l.user_id
JOIN MODIFICATION m ON m.id = l.modification_id
WHERE l.id = 1;

-- Read (all, with optional filters)
SELECT * FROM LISTING WHERE price BETWEEN 10000 AND 30000 ORDER BY created_at DESC;

-- Update
UPDATE LISTING
SET price = 13900.00, description = 'Price dropped'
WHERE id = 1
RETURNING *;

-- Delete
DELETE FROM LISTING WHERE id = 1;


