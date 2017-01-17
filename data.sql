CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role TEXT,
    username TEXT,
    email TEXT,
    password TEXT,
    last_login TIMESTAMP,
    date_created TIMESTAMP,
    date_deleted TIMESTAMP
);

CREATE TABLE watchlists (
    user_id INT,
    movie_id INT
);

CREATE TABLE favorite_movies (
    user_id INT,
    movie_id INT
);