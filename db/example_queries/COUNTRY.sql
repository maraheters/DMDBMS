-- Create
INSERT INTO COUNTRY (name)
VALUES ('Italy')
RETURNING *;

-- Read (by id)
SELECT * FROM COUNTRY WHERE id = 1;

-- Read (all)
SELECT * FROM COUNTRY ORDER BY name;

-- Update
UPDATE COUNTRY
SET name = 'France'
WHERE id = 1
RETURNING *;

-- Delete
DELETE FROM COUNTRY WHERE id = 1;


