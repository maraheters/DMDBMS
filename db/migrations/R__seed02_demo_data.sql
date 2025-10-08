TRUNCATE TABLE
    USER_ACTIVITY,
    FAVORITE,
    DOCUMENT,
    IMAGE,
    LISTING,
    PROFILE,
    "USER",
    MODIFICATION,
    GENERATION,
    CAR_MODEL,
    MANUFACTURER
RESTART IDENTITY CASCADE;

-- MANUFACTURER
INSERT INTO MANUFACTURER (name, country_id)
SELECT 'BMW', c.id FROM COUNTRY c WHERE c.name = 'Germany';
INSERT INTO MANUFACTURER (name, country_id)
SELECT 'Toyota', c.id FROM COUNTRY c WHERE c.name = 'Japan';

-- CAR_MODEL
INSERT INTO CAR_MODEL (name, manufacturer_id)
SELECT '3 Series', m.id FROM MANUFACTURER m WHERE m.name = 'BMW';
INSERT INTO CAR_MODEL (name, manufacturer_id)
SELECT 'Corolla', m.id FROM MANUFACTURER m WHERE m.name = 'Toyota';

-- GENERATION
INSERT INTO GENERATION (name, start_year, car_model_id)
SELECT 'G20', 2018, cm.id FROM CAR_MODEL cm WHERE cm.name = '3 Series';
INSERT INTO GENERATION (name, start_year, car_model_id)
SELECT 'E210', 2018, cm.id FROM CAR_MODEL cm WHERE cm.name = 'Corolla';

-- MODIFICATION
INSERT INTO MODIFICATION (name, generation_id, engine_id, transmission_id, body_id)
SELECT '320i', g.id, e.id, t.id, b.id
FROM GENERATION g, ENGINE e, TRANSMISSION t, BODY b WHERE g.name = 'G20' AND e.type = 'Petrol' AND t.type = 'Automatic' AND b.type = 'Sedan'
LIMIT 1;

INSERT INTO MODIFICATION (name, generation_id, engine_id, transmission_id, body_id)
SELECT '1.6', g.id, e.id, t.id, b.id
FROM GENERATION g, ENGINE e, TRANSMISSION t, BODY b
WHERE g.name = 'E210' AND e.type = 'Diesel' AND t.type = 'Manual' AND b.type = 'SUV'
LIMIT 1;

-- USER
INSERT INTO "USER" (name, email, password_hash, role_id)
SELECT 'Alice Admin', 'alice@example.com', 'hash_admin', r.id FROM ROLE r WHERE r.name = 'admin';
INSERT INTO "USER" (name, email, password_hash, role_id)
SELECT 'Bob User', 'bob@example.com', 'hash_user', r.id FROM ROLE r WHERE r.name = 'user';

-- PROFILE
INSERT INTO PROFILE (user_id, phone, address, avatar_url, birth_date)
SELECT u.id, '+4900000001', 'Berlin, DE', NULL, '1990-01-01' FROM "USER" u WHERE u.email = 'alice@example.com';
INSERT INTO PROFILE (user_id, phone, address, avatar_url, birth_date)
SELECT u.id, '+8100000002', 'Tokyo, JP', NULL, '1992-02-02' FROM "USER" u WHERE u.email = 'bob@example.com';

-- LISTING
INSERT INTO LISTING (title, description, mileage, price, user_id, modification_id, created_at)
SELECT 'BMW 320i G20', 'Well maintained', 35000, 29999.99, u.id, m.id, CURRENT_TIMESTAMP
FROM "USER" u CROSS JOIN MODIFICATION m
WHERE u.email = 'alice@example.com' AND m.name = '320i'
LIMIT 1;

INSERT INTO LISTING (title, description, mileage, price, user_id, modification_id, created_at)
SELECT 'Toyota Corolla E210', 'Reliable daily driver', 50000, 18999.00, u.id, m.id, CURRENT_TIMESTAMP
FROM "USER" u CROSS JOIN MODIFICATION m
WHERE u.email = 'bob@example.com' AND m.name = '1.6'
LIMIT 1;

-- IMAGE
INSERT INTO IMAGE (url, "order", listing_id)
SELECT 'https://img.example.com/320i-1.jpg', 0, l.id FROM LISTING l WHERE l.title = 'BMW 320i G20';
INSERT INTO IMAGE (url, "order", listing_id)
SELECT 'https://img.example.com/corolla-1.jpg', 0, l.id FROM LISTING l WHERE l.title = 'Toyota Corolla E210';

-- DOCUMENT
INSERT INTO DOCUMENT (url, listing_id)
SELECT 'https://docs.example.com/320i-doc.pdf', l.id FROM LISTING l WHERE l.title = 'BMW 320i G20';
INSERT INTO DOCUMENT (url, listing_id)
SELECT 'https://docs.example.com/corolla-doc.pdf', l.id FROM LISTING l WHERE l.title = 'Toyota Corolla E210';

-- FAVORITE
INSERT INTO FAVORITE (user_id, listing_id)
SELECT u.id, l.id FROM "USER" u, LISTING l
WHERE u.email = 'bob@example.com' AND l.title = 'BMW 320i G20'
LIMIT 1;

-- USER_ACTIVITY
INSERT INTO USER_ACTIVITY (user_id, action, details)
SELECT u.id, 'LOGIN', 'Seed login' FROM "USER" u WHERE u.email = 'alice@example.com';
INSERT INTO USER_ACTIVITY (user_id, action, details)
SELECT u.id, 'CREATE_LISTING', 'Seed listing creation' FROM "USER" u WHERE u.email = 'bob@example.com';


