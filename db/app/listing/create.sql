WITH new_listing AS (
  INSERT INTO LISTING (title, description, mileage, price, user_id, modification_id)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING id
),
insert_images AS (
  INSERT INTO IMAGE (url, "order", listing_id)
  SELECT i->>'url', (i->>'order')::int, (SELECT id FROM new_listing)
  FROM jsonb_array_elements($7::jsonb) AS i
),
insert_documents AS (
  INSERT INTO DOCUMENT (url, listing_id)
  SELECT d->>'url', (SELECT id FROM new_listing)
  FROM jsonb_array_elements($8::jsonb) AS d
)
SELECT id FROM new_listing;
