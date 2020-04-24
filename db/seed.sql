DROP DATABASE IF EXISTS backend_testing_users_db;
CREATE DATABASE backend_testing_users_db;

\c backend_testing_users_db;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR NOT NULL UNIQUE,
  password_digest VARCHAR NOT NULL
);

CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  message VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO users (username, password_digest) 
  VALUES 
                -- "hello123" in plain text
    ('JonSnow', '$2b$12$uGJwDajFyjjMigWICJTM/OjqAEoDwO4oLPlI9wiQDCLQax07Jygy.'),
    ('MichaelJordan', '$2b$12$uGJwDajFyjjMigWICJTM/OjqAEoDwO4oLPlI9wiQDCLQax07Jygy.');

INSERT INTO notes (user_id, message) 
  VALUES 
    (1, 'They were born on the wrong side of the Wall — doesn''t make them monsters.'),
    (1, 'Night gathers, and now my watch begins.'),
    (2, 'Some people want it to happen, some wish it would happen, others make it happen.'),
    (2, 'Talent wins games, but teamwork and intelligence wins championships.');

