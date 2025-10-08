-- Create (with FK to ROLE). Note: password should be a secure hash in real apps.
INSERT INTO "USER" (name, email, password_hash, role_id)
SELECT 'Client Client', 'aboba@example.com', 'hash', r.id
FROM ROLE r WHERE r.name = 'user'
RETURNING *;

-- Read (by id)
SELECT * FROM "USER" WHERE id = 1;

-- Read (all)
SELECT * FROM "USER";

-- Update (change role)
UPDATE "USER"
SET role_id = (SELECT id FROM ROLE WHERE name = 'admin')
WHERE id = 1
RETURNING *;

-- Delete
DELETE FROM "USER" WHERE id = 1;


