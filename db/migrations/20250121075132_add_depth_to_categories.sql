-- migrate:up
ALTER TABLE categories
ADD COLUMN depth integer DEFAULT 0;

-- migrate:down
ALTER TABLE categories
DROP COLUMN depth;
