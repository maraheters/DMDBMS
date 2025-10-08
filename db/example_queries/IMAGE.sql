-- Create
INSERT INTO IMAGE (url, "order", listing_id)
SELECT 'https://img.example.com/megane-1.jpg', 0, l.id FROM LISTING l WHERE l.title = 'Megane TCe 140'
RETURNING *;

-- Read (by id)
SELECT * FROM IMAGE WHERE id = 1;

-- Read (by listing)
SELECT * FROM IMAGE WHERE listing_id = 1 ORDER BY "order";

-- Update (reorder)
UPDATE IMAGE
SET "order" = 1
WHERE id = 1
RETURNING *;

-- Delete
DELETE FROM IMAGE WHERE id = 1;


