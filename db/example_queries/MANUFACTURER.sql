-- Create (with FK to COUNTRY)
INSERT INTO MANUFACTURER (name, country_id)
SELECT 'Renault', c.id FROM COUNTRY c WHERE c.name = 'France'
RETURNING *;

-- Read (by id)
SELECT * FROM MANUFACTURER WHERE id = 1;

-- Read (all)
SELECT * FROM MANUFACTURER;

-- Update
UPDATE MANUFACTURER
SET name = 'Renault Group'
WHERE id = 1
RETURNING *;

-- Delete
DELETE FROM MANUFACTURER WHERE id = 1;


