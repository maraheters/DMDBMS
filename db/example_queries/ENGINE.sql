-- Create
INSERT INTO ENGINE (type, configuration, power_kw, torque_nm, displacement)
VALUES ('Hybrid', 'I4', 140, 300, 2.0)
RETURNING *;

-- Read (by id)
SELECT * FROM ENGINE WHERE id = 1;

-- Read (filtered)
SELECT * FROM ENGINE WHERE power_kw >= 100 ORDER BY power_kw DESC;

-- Update
UPDATE ENGINE
SET power_kw = 150, torque_nm = 320
WHERE id = 1
RETURNING *;

-- Delete
DELETE FROM ENGINE WHERE id = 1;


