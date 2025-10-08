-- Таблица объявлений (LISTING)
CREATE TABLE LISTING (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    mileage INT CHECK (mileage >= 0),
    price DECIMAL(12, 2) CHECK (price >= 0),
    user_id INT,
    modification_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES "USER"(id),
    FOREIGN KEY (modification_id) REFERENCES MODIFICATION(id)
);

-- Таблица изображений (IMAGE)
CREATE TABLE IMAGE (
    id SERIAL PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    "order" INT CHECK ("order" >= 0),
    listing_id INT,
    FOREIGN KEY (listing_id) REFERENCES LISTING(id) ON DELETE CASCADE
);

-- Таблица документов (DOCUMENT)
CREATE TABLE DOCUMENT (
    id SERIAL PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    listing_id INT,
    FOREIGN KEY (listing_id) REFERENCES LISTING(id) ON DELETE CASCADE
);

-- Таблица избранного (FAVORITE) - связующая M:N
CREATE TABLE FAVORITE (
    user_id INT,
    listing_id INT,
    PRIMARY KEY (user_id, listing_id),
    FOREIGN KEY (user_id) REFERENCES "USER"(id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES LISTING(id) ON DELETE CASCADE
);