-- migrate:up
-- Step 1: Remove `thumbnail_id` column from `posts` table
ALTER TABLE posts
DROP CONSTRAINT IF EXISTS posts_thumbnail_id_fkey,
DROP COLUMN thumbnail_id;

-- Step 2: Add `is_thumbnail` column to `post_images` table
ALTER TABLE post_images
ADD COLUMN is_thumbnail BOOLEAN NOT NULL DEFAULT FALSE;

-- migrate:down
-- Step 1: Add `thumbnail_id` column back to `posts` table
ALTER TABLE posts
ADD COLUMN thumbnail_id INTEGER REFERENCES post_images(id);

-- Step 2: Remove `is_thumbnail` column from `post_images` table
ALTER TABLE post_images
DROP COLUMN is_thumbnail;
