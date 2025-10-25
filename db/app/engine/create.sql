INSERT INTO engine (name, type, configuration, power_kw, torque_nm, displacement)
VALUES($1, $2, $3, $4, $5, $6)
RETURNING id;