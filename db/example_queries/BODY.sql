-- Create
INSERT INTO BODY (type)
VALUES ('Hatchback')
RETURNING *;

-- Read (by id)
SELECT * FROM BODY WHERE id = 1;

-- Read (all)
SELECT * FROM BODY ORDER BY id;

-- Update
UPDATE BODY
SET type = 'Wagon'
WHERE type = 'Coupe'
RETURNING *;

-- Delete
DELETE FROM BODY WHERE id = 1;
