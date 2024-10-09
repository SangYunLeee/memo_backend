-- migrate:up
CREATE INDEX idx_posts_cate_id
ON posts (cate_id);

-- migrate:down
DROP INDEX IF EXISTS idx_posts_cate_id;
