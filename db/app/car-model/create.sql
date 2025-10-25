INSERT INTO CAR_MODEL(name, manufacturer_id) 
VALUES ($1, $2)
RETURNING id;