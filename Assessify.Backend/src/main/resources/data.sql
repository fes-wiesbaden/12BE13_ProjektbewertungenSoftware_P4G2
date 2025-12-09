-- Insert default roles
INSERT INTO role (id, role) VALUES
                                (1, 'ADMIN'),
                                (2, 'TEACHER'),
                                (3, 'STUDENT')
    ON CONFLICT DO NOTHING;

-- Insert sample users (password: "password123" - you should hash this in production)
INSERT INTO user (id, first_name, last_name, username, password, role_id, class_id, is_active) VALUES
-- Admin
(1, 'Admin', 'User', 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NULL, TRUE)
ON CONFLICT DO NOTHING;


