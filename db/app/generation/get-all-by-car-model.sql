SELECT * FROM generation
WHERE car_model_id = $1
ORDER BY start_year;