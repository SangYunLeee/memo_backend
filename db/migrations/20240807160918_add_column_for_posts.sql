-- migrate:up
ALTER TABLE posts ADD COLUMN content_slate VARCHAR(6000);

-- migrate:down
ALTER TABLE posts DROP COLUMN content_slate;
