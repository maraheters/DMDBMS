-- Выбрать объявления, которые никто не добавил в избранное и юзеров, которые ничего не добавили в избранное
SELECT
    U.name AS user_name,
    L.title AS listing_title
FROM
    "USER" AS U
FULL OUTER JOIN
    FAVORITE AS F ON U.id = F.user_id
FULL OUTER JOIN
    LISTING AS L ON F.listing_id = L.id
WHERE
    U.id IS NULL OR L.id IS NULL;