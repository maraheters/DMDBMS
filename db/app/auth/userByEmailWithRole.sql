SELECT
    U.id,
    U.email,
    U.password_hash,
    U.role_id,
    R.name as role_name
FROM "USER" AS U
JOIN ROLE AS R ON U.role_id = R.id
WHERE U.email = $1;