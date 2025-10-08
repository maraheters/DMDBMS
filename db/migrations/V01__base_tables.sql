-- Таблица ролей пользователей (ROLE)
CREATE TABLE ROLE (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Таблица стран (COUNTRY)
CREATE TABLE COUNTRY (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Таблица двигателей (ENGINE)
CREATE TABLE ENGINE (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    configuration VARCHAR(255),
    power_kw INT CHECK (power_kw > 0),
    torque_nm INT CHECK (torque_nm > 0),
    displacement DECIMAL(3, 1) CHECK (displacement > 0)
);

-- Таблица трансмиссий (TRANSMISSION)
CREATE TABLE TRANSMISSION (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    gears_num INT CHECK (gears_num > 0)
);

-- Таблица типов кузова (BODY)
CREATE TABLE BODY (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL
);