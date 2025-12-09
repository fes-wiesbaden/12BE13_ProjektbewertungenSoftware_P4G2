-- Insert default roles
INSERT INTO role (id, role_name) VALUES
                                (1, 'ADMIN'),
                                (2, 'TEACHER'),
                                (3, 'STUDENT')
    ON CONFLICT DO NOTHING;

-- Insert sample users (password: "password123" - you should hash this in production)
INSERT INTO "user" ( first_name, last_name, username, password, role_id, class_id, is_active) VALUES
-- Admin
('Admin', 'User', 'admin', 'admin.123', 1, NULL, TRUE)
ON CONFLICT (username) DO NOTHING;


