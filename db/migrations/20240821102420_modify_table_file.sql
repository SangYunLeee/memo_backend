-- migrate:up

CREATE TABLE user_files (
  id SERIAL PRIMARY KEY,
  original_filename varchar(255) NOT NULL,
  stored_filename varchar(255) NOT NULL,
  file_size bigint NOT NULL,
  mime_type varchar(100),
  created_at timestamp NOT NULL DEFAULT NOW(),
  file_path varchar(1000) NOT NULL,
  description text,
  user_id integer REFERENCES users(id) NOT NULL
);

CREATE TABLE post_files (
  id SERIAL PRIMARY KEY,
  original_filename varchar(255) NOT NULL,
  stored_filename varchar(255) NOT NULL,
  file_size bigint NOT NULL,
  mime_type varchar(100),
  created_at timestamp NOT NULL DEFAULT NOW(),
  file_path varchar(1000) NOT NULL,
  description text,
  post_id integer REFERENCES posts(id) NOT NULL,
  user_id integer REFERENCES users(id) NOT NULL
);


ALTER TABLE posts
DROP COLUMN thumnail_img_url,
ADD COLUMN thumbnail_id integer REFERENCES post_files(id);


ALTER TABLE users
ADD COLUMN thumbnail_id integer REFERENCES user_files(id);

DROP TABLE files;

-- migrate:down

ALTER TABLE posts
DROP COLUMN thumbnail_id,
ADD COLUMN thumnail_img_url varchar(1000);

ALTER TABLE users
DROP COLUMN thumbnail_id;

CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  original_filename varchar(255) NOT NULL,
  stored_filename varchar(255) NOT NULL,
  file_size bigint NOT NULL,
  mime_type varchar(100),
  created_at timestamp NOT NULL DEFAULT NOW(),
  post_id integer REFERENCES posts(id),
  user_id integer REFERENCES users(id),
  file_path varchar(1000) NOT NULL,
  description text
);

DROP TABLE post_files;
DROP TABLE user_files;
