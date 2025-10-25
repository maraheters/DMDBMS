TRUNCATE TABLE
    ROLE,
    "USER"
RESTART IDENTITY CASCADE;

-- ROLE
INSERT INTO ROLE (name) VALUES
    ('admin'),
    ('user');

-- USER
INSERT INTO "USER" (name, email, password_hash, role_id)
SELECT 'Admin Admin', 'adminadmin@example.com', '$2a$10$1dvAqBo0MS6VpktXUAqyDuICJeObi.9ZHnJXO///gBpMMkwfnVdiq', r.id FROM ROLE r WHERE r.name = 'admin';