-- Create
INSERT INTO USER_ACTIVITY (user_id, action, timestamp, details)
SELECT 1, 'VIEW_LISTING', CURRENT_TIMESTAMP, 'Viewed listing Megane TCe 140'
RETURNING *;

-- Read
SELECT * FROM USER_ACTIVITY WHERE user_id = 1 ORDER BY timestamp DESC;

-- Delete
DELETE FROM USER_ACTIVITY WHERE timestamp < NOW() - INTERVAL '365 days';
