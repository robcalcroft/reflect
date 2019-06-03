INSERT INTO users (name, email_address, password) VALUES ('Test user', 'test@user.com', 'pass');
INSERT INTO boards (name, user_id) VALUES ('Test board', 1);
INSERT INTO lists (board_id, name, user_id) VALUES (1,'Test list', 1);
INSERT INTO cards (body, list_id, position, user_id) VALUES ('Not enough features', 1,1,1);
