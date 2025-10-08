-- Create
INSERT INTO FAVORITE (user_id, listing_id)
VALUES(1, 1);

-- Read (check if listing is favorited by user)
SELECT * FROM FAVORITE WHERE id = 1;

-- Read (all favorites for user)
SELECT * FROM FAVORITE
WHERE user_id = 1;

-- Delete (remove from favorites)
DELETE FROM FAVORITE
WHERE user_id = 1;

