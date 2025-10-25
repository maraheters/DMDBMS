SELECT * FROM modification
WHERE generation_id = $1
ORDER BY name;