-- Create (with FK to CAR_MODEL)
INSERT INTO GENERATION (name, start_year, car_model_id)
SELECT 'IV', 2016, cm.id FROM CAR_MODEL cm WHERE cm.name = 'Mégane'
RETURNING *;

-- Read (by id)
SELECT * FROM GENERATION WHERE id = 1;

-- Read (all)
SELECT * FROM GENERATION;

-- Update
UPDATE GENERATION
SET start_year = 2017
WHERE id = 1
RETURNING *;

-- Delete
DELETE FROM GENERATION WHERE id = 1;


