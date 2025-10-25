INSERT INTO generation(name, start_year, car_model_id)
VALUES($1, $2, $3)
RETURNING id;