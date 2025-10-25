SELECT * FROM car_model
WHERE manufacturer_id = $1
ORDER BY name;