-- Таблица пользователей (USER)
CREATE TABLE "USER" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES ROLE(id)
);

-- Таблица профилей пользователей (PROFILE)
CREATE TABLE PROFILE (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    phone VARCHAR(50),
    address VARCHAR(255),
    avatar_url VARCHAR(255),
    birth_date DATE,
    FOREIGN KEY (user_id) REFERENCES "USER"(id) ON DELETE CASCADE
);

-- Таблица производителей (MANUFACTURER)
CREATE TABLE MANUFACTURER (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country_id INT,
    FOREIGN KEY (country_id) REFERENCES COUNTRY(id)
);

-- Таблица моделей автомобилей (CAR_MODEL)
CREATE TABLE CAR_MODEL (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    manufacturer_id INT,
    FOREIGN KEY (manufacturer_id) REFERENCES MANUFACTURER(id)
);

-- Таблица поколений моделей (GENERATION)
CREATE TABLE GENERATION (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_year INT,
    car_model_id INT,
    FOREIGN KEY (car_model_id) REFERENCES CAR_MODEL(id)
);

-- Таблица модификаций (MODIFICATION)
CREATE TABLE MODIFICATION (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    generation_id INT,
    engine_id INT,
    transmission_id INT,
    body_id INT,
    FOREIGN KEY (generation_id) REFERENCES GENERATION(id),
    FOREIGN KEY (engine_id) REFERENCES ENGINE(id),
    FOREIGN KEY (transmission_id) REFERENCES TRANSMISSION(id),
    FOREIGN KEY (body_id) REFERENCES BODY(id)
);