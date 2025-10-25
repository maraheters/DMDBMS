INSERT INTO country (name) 
VALUES ($1)
RETURNING id;