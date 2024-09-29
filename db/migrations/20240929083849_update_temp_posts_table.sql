-- migrate:up
ALTER TABLE temp_posts
ADD COLUMN users_id INTEGER NOT NULL,
ADD COLUMN content VARCHAR(6000) NOT NULL,
ADD CONSTRAINT fk_temp_posts_users FOREIGN KEY (users_id) REFERENCES users(id);

-- migrate:down
ALTER TABLE temp_posts
DROP COLUMN content,
DROP COLUMN users_id;
