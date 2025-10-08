-- Таблица активности пользователей (USER_ACTIVITY)
CREATE TABLE USER_ACTIVITY (
    id SERIAL PRIMARY KEY,
    user_id INT,
    action VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT,
    FOREIGN KEY (user_id) REFERENCES "USER"(id) ON DELETE SET NULL
);