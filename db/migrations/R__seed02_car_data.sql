TRUNCATE TABLE
    COUNTRY,
    BODY,
    MANUFACTURER,
    ENGINE,
    CAR_MODEL,
    GENERATION,
    MODIFICATION
RESTART IDENTITY CASCADE;

-- БАЗОВЫЕ ДАННЫЕ (Страны, Типы кузова)
-- ------------------------------------------------
-- 1. Страны
INSERT INTO COUNTRY (id, name) VALUES
(1, 'Germany'),
(2, 'Japan'),
(3, 'USA'),
(4, 'France')
ON CONFLICT (id) DO NOTHING; -- Используем ID для простоты примера

-- 2. Типы кузова
INSERT INTO BODY (id, type) VALUES
(1, 'Sedan'),
(2, 'Coupe'),
(3, 'Hatchback'),
(4, 'Wagon'),
(5, 'SUV')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------
-- ПРОИЗВОДИТЕЛИ
-- ------------------------------------------------
INSERT INTO MANUFACTURER (id, name, country_id) VALUES
(1, 'Audi', 1),
(2, 'BMW', 1),
(3, 'Toyota', 2),
(4, 'Ford', 3),
(5, 'Volkswagen', 1),
(6, 'Honda', 2),
(7, 'Tesla', 3),
(8, 'Renault', 4),
(9, 'Subaru', 2)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------
-- ДВИГАТЕЛИ (10 шт.)
-- ------------------------------------------------
INSERT INTO ENGINE (id, name, type, configuration, power_kw, torque_nm, displacement) VALUES
(1, '2.0 TDI (140 kW)', 'Diesel', 'Inline-4', 140, 400, 2.0),
(2, 'B48 2.0T (190 kW)', 'Petrol', 'Inline-4', 190, 400, 2.0),
(3, 'A25A-FXS 2.5 Hybrid', 'Hybrid', 'Inline-4', 160, 221, 2.5),
(4, 'Coyote 5.0 V8', 'Petrol', 'V8', 331, 556, 5.0),
(5, '1.5 eTSI (110 kW)', 'Mild-Hybrid', 'Inline-4', 110, 250, 1.5),
(6, 'K20C1 2.0 VTEC Turbo', 'Petrol', 'Inline-4', 235, 400, 2.0),
(7, 'Dual Motor LR (366 kW)', 'Electric', 'Dual-Motor', 366, 660, 0.1), -- 0.1 для CHECK (> 0)
(8, 'H5Ht 1.0 TCe (74 kW)', 'Petrol', 'Inline-3', 74, 160, 1.0),
(9, 'FA24F 2.4T Boxer', 'Petrol', 'Boxer-4', 194, 375, 2.4),
(10, '3.0 TDI (210 kW)', 'Diesel', 'V6', 210, 620, 3.0)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------
-- МОДЕЛИ (10 шт.)
-- ------------------------------------------------
INSERT INTO CAR_MODEL (id, name, manufacturer_id) VALUES
(1, 'A4', 1),
(2, '3 Series', 2),
(3, 'Camry', 3),
(4, 'Mustang', 4),
(5, 'Golf', 5),
(6, 'Civic', 6),
(7, 'Model 3', 7),
(8, 'Clio', 8),
(9, 'Outback', 9),
(10, 'Q5', 1) -- Еще одна Audi
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------
-- ПОКОЛЕНИЯ (10 шт.)
-- ------------------------------------------------
INSERT INTO GENERATION (id, name, start_year, car_model_id) VALUES
(1, 'B9', 2015, 1),
(2, 'G20', 2019, 2),
(3, 'XV70', 2017, 3),
(4, 'S550', 2015, 4),
(5, 'Mk8', 2019, 5),
(6, 'FK8 (Type R)', 2017, 6),
(7, 'Gen 1', 2017, 7),
(8, 'V', 2019, 8),
(9, 'BT', 2021, 9),
(10, 'FY', 2017, 10)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------
-- МОДИФИКАЦИИ (10 шт.)
-- ------------------------------------------------
INSERT INTO MODIFICATION (id, name, generation_id, engine_id, body_id) VALUES
(1, '2.0 TDI S tronic (140 kW)', 1, 1, 1), -- Audi A4 B9, 2.0 TDI, Sedan
(2, '330i (190 kW)', 2, 2, 1),             -- BMW 3 Series G20, 2.0T, Sedan
(3, '2.5 Hybrid (160 kW)', 3, 3, 1),       -- Toyota Camry XV70, 2.5 Hybrid, Sedan
(4, 'GT 5.0 V8 (331 kW)', 4, 4, 2),        -- Ford Mustang S550, 5.0 V8, Coupe
(5, '1.5 eTSI (110 kW)', 5, 5, 3),         -- VW Golf Mk8, 1.5 eTSI, Hatchback
(6, 'Type R (235 kW)', 6, 6, 3),           -- Honda Civic FK8, 2.0T, Hatchback
(7, 'Long Range Dual Motor', 7, 7, 1),     -- Tesla Model 3, Electric, Sedan
(8, '1.0 TCe (74 kW)', 8, 8, 3),           -- Renault Clio V, 1.0 TCe, Hatchback
(9, '2.4T (194 kW)', 9, 9, 4),             -- Subaru Outback BT, 2.4T, Wagon
(10, '50 TDI (210 kW)', 10, 10, 5)         -- Audi Q5 FY, 3.0 TDI, SUV
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------
-- ТРАНСМИССИИ (10 шт., 1-к-1 к Модификациям)
-- ------------------------------------------------
INSERT INTO TRANSMISSION (id, type, gears_num, modification_id) VALUES
(1, 'Automatic', 7, 1), -- S tronic (DSG)
(2, 'Automatic', 8, 2), -- Steptronic
(3, 'Automatic', 1, 3), -- e-CVT
(4, 'Automatic', 10, 4), -- 10R80
(5, 'Automatic', 7, 5), -- DSG
(6, 'Manual', 6, 6),
(7, 'Automatic', 1, 7), -- Single Speed
(8, 'Automatic', 1, 8), -- X-Tronic (CVT)
(9, 'Automatic', 8, 9), -- Lineartronic (CVT c 8 "передачами")
(10, 'Automatic', 8, 10) -- Tiptronic
ON CONFLICT (id) DO NOTHING;

SELECT setval('country_id_seq', (SELECT MAX(id) FROM country));                                                
SELECT setval('body_id_seq', (SELECT MAX(id) FROM body));                                                
SELECT setval('manufacturer_id_seq', (SELECT MAX(id) FROM manufacturer));                                      
SELECT setval('engine_id_seq', (SELECT MAX(id) FROM engine));                                              
SELECT setval('car_model_id_seq', (SELECT MAX(id) FROM car_model));                                           
SELECT setval('generation_id_seq', (SELECT MAX(id) FROM generation));                                        
SELECT setval('modification_id_seq', (SELECT MAX(id) FROM modification));                                      
SELECT setval('transmission_id_seq', (SELECT MAX(id) FROM transmission));  