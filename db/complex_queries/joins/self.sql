SELECT
    L1.id AS listing_A_id,
    L1.title AS listing_A_title,
    L2.id AS listing_B_id,
    L2.title AS listing_B_title,
    U.name AS user_name
FROM
    LISTING AS L1
JOIN
    LISTING AS L2 ON L1.user_id = L2.user_id
JOIN
    "USER" AS U ON L1.user_id = U.id
WHERE
    -- чтобы не находить объявление с самим собой (A-A)
    -- и чтобы не было дублей (A-B и B-A).
    L1.id < L2.id
AND
    L1.modification_id != L2.modification_id;