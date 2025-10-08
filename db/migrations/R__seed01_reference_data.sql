TRUNCATE TABLE
    ROLE,
    COUNTRY,
    ENGINE,
    TRANSMISSION,
    BODY
RESTART IDENTITY CASCADE;

-- ROLE
INSERT INTO ROLE (name) VALUES
    ('admin'),
    ('user');

-- COUNTRY
INSERT INTO COUNTRY (name) VALUES
    ('Germany'),
    ('Japan'),
    ('USA');

-- BODY
INSERT INTO BODY (type) VALUES
    ('Sedan'),
    ('Hatchback'),
    ('SUV');

-- TRANSMISSION
INSERT INTO TRANSMISSION (type, gears_num) VALUES
    ('Manual', 6),
    ('Automatic', 8);

-- ENGINE
INSERT INTO ENGINE (type, configuration, power_kw, torque_nm, displacement) VALUES
    ('Petrol', 'I4 Turbo', 135, 280, 2.0),
    ('Diesel', 'I4 Turbo', 110, 320, 2.0);


