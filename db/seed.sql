-- Creating and Dropping a Database should be done manually and only once
-- That is why the following lines are commented out

-- DROP DATABASE IF EXISTS backend_testing_users_db;
-- CREATE DATABASE backend_testing_users_db;
-- \c backend_testing_users_db;

DROP TABLE notes;
DROP TABLE users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR NOT NULL UNIQUE,
  password_digest VARCHAR NOT NULL
);

CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  text VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_public BOOLEAN DEFAULT TRUE
);

INSERT INTO users (username, password_digest) 
  VALUES 
     --  password is "hello123" in plain text
    ('JonSnow', '$2b$12$uGJwDajFyjjMigWICJTM/OjqAEoDwO4oLPlI9wiQDCLQax07Jygy.'),
    ('MichaelJordan', '$2b$12$uGJwDajFyjjMigWICJTM/OjqAEoDwO4oLPlI9wiQDCLQax07Jygy.');

INSERT INTO notes (user_id, text, is_public) 
  VALUES 
    (1, 'They were born on the wrong side of the Wall — doesn''t make them monsters.', TRUE),
    (1, 'Night gathers, and now my watch begins.', FALSE),
    (2, 'Some people want it to happen, some wish it would happen, others make it happen.', TRUE),
    (2, 'Talent wins games, but teamwork and intelligence wins championships.', FALSE);

