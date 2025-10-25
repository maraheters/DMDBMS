WITH inserted_modification AS (
  INSERT INTO modification (name, generation_id, engine_id, body_id)
  VALUES ($1, $2, $3, $4) 
  RETURNING id;
),
inserted_transmission AS (
  INSERT INTO TRANSMISSION(type, gears_num, modification_id)
  VALUES ($5, $6, (SELECT id FROM inserted_modification))
)
SELECT id FROM inserted_modification;
