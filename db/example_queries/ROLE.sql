-- Create
INSERT INTO ROLE (name)
VALUES ('Manager')
RETURNING *;

-- Read (by id)
SELECT * FROM ROLE WHERE id = 1;

-- Read (all)
SELECT * FROM ROLE ORDER BY id;

-- Update
UPDATE ROLE
SET name = 'Supervisor'
WHERE id = 1
RETURNING *;

-- Delete
DELETE FROM ROLE WHERE id = 1;


