SELECT
    U.name,
    U.email,
    P.phone
FROM
    "USER" AS U
LEFT OUTER JOIN
    PROFILE AS P ON U.id = P.user_id;