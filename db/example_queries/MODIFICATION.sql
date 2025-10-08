-- Create (with FKs to GENERATION, ENGINE, TRANSMISSION, BODY)
INSERT INTO MODIFICATION (name, generation_id, engine_id, transmission_id, body_id)
SELECT 'TCe 140', g.id, e.id, t.id, b.id
FROM GENERATION g, ENGINE e, TRANSMISSION t, BODY b
WHERE g.name = 'IV' AND e.type = 'Hybrid' AND t.type = 'CVT' AND b.type = 'Hatchback'
LIMIT 1
RETURNING *;

-- Read (by id, with joins)
SELECT m.id, m.name,
       g.name AS generation_name,
       e.type AS engine_type,
       t.type AS transmission_type,
       b.type AS body_type
FROM MODIFICATION m
JOIN GENERATION g ON g.id = m.generation_id
JOIN ENGINE e ON e.id = m.engine_id
JOIN TRANSMISSION t ON t.id = m.transmission_id
JOIN BODY b ON b.id = m.body_id
WHERE m.id = 1;

-- Read (all)
SELECT * FROM MODIFICATION ORDER BY id;

-- Update
UPDATE MODIFICATION
SET name = 'TCe 160'
WHERE id = 1
RETURNING *;

-- Delete
DELETE FROM MODIFICATION WHERE id = 1;


