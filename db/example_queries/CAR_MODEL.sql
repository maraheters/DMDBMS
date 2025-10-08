-- Create (with FK to MANUFACTURER)
INSERT INTO CAR_MODEL (name, manufacturer_id)
SELECT 'Megane', m.id FROM MANUFACTURER m WHERE m.name = 'Renault'
RETURNING *;

-- Read (by id)
SELECT * FROM CAR_MODEL WHERE id = 1;

-- Read (all)
SELECT * FROM CAR_MODEL ORDER BY id;

-- Update
UPDATE CAR_MODEL
SET name = 'Megane'
WHERE id = 1
RETURNING *;

-- Delete
DELETE FROM CAR_MODEL WHERE id = 1;


