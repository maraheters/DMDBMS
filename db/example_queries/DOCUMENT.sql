-- Create
INSERT INTO DOCUMENT (url, listing_id)
SELECT 'https://docs.example.com/megane-doc.pdf', l.id FROM LISTING l WHERE l.title = 'Megane TCe 140'
RETURNING *;

-- Read (by id)
SELECT * FROM DOCUMENT WHERE id = 1;

-- Read (by listing)
SELECT * FROM DOCUMENT WHERE listing_id = 1;

-- Update
UPDATE DOCUMENT
SET url = 'https://docs.example.com/megane-doc-v2.pdf'
WHERE id = 1
RETURNING *;

-- Delete
DELETE FROM DOCUMENT WHERE id = 1;


