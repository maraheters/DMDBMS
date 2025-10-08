-- Create (1:1 with USER)
INSERT INTO PROFILE (user_id, phone, address, avatar_url, birth_date)
SELECT u.id, '+1234567890', 'Minsk, BY', NULL, '1995-05-05'
FROM "USER" u WHERE u.email = 'aboba@example.com'
RETURNING *;

-- Read (by id)
SELECT p.*, u.email
FROM PROFILE p
JOIN "USER" u ON u.id = p.user_id
WHERE p.id = 1;

-- Read (by user)
SELECT * FROM PROFILE WHERE user_id = 1;

-- Update
UPDATE PROFILE
SET phone = '+1230000000', address = 'Updated address'
WHERE id = 1
RETURNING *;

-- Delete
DELETE FROM PROFILE WHERE id = 1;


