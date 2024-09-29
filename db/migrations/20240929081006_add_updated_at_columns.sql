-- migrate:up
ALTER TABLE posts
ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT NOW();

ALTER TABLE temp_posts
ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT NOW(),
ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT NOW();

-- migrate:down
ALTER TABLE posts
DROP COLUMN updated_at;

ALTER TABLE temp_posts
DROP COLUMN created_at,
DROP COLUMN updated_at;
