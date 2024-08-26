-- migrate:up
-- Step 1: Create new post_images table
CREATE TABLE post_images (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id),
  original_filename VARCHAR(255) NOT NULL,
  stored_filename VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  file_path VARCHAR(1000) NOT NULL,
  is_temporary BOOLEAN NOT NULL DEFAULT TRUE
);

-- Step 2: Update posts table to reference post_images instead of post_files
ALTER TABLE posts
DROP CONSTRAINT posts_thumbnail_id_fkey,
DROP COLUMN thumbnail_id,
ADD COLUMN thumbnail_id INTEGER REFERENCES post_images(id);

-- Step 3: Drop user_id from post_files and remove description from user_files
ALTER TABLE user_files
DROP COLUMN description;

-- Step 4: Remove the post_files table
DROP TABLE post_files;

-- migrate:down
-- Step 1: Recreate post_files table
CREATE TABLE post_files (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  post_id INTEGER NOT NULL REFERENCES posts(id),
  original_filename VARCHAR(255) NOT NULL,
  stored_filename VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  file_path VARCHAR(1000) NOT NULL,
  description TEXT,
  is_temporary BOOLEAN NOT NULL DEFAULT TRUE
);

-- Step 2: Update posts table to reference post_files instead of post_images
ALTER TABLE posts
DROP CONSTRAINT posts_thumbnail_id_fkey,
DROP COLUMN thumbnail_id,
ADD COLUMN thumbnail_id INTEGER REFERENCES post_files(id);

-- Step 3: Add description column back to user_files
ALTER TABLE user_files
ADD COLUMN description TEXT;

-- Step 4: Drop the post_images table
DROP TABLE post_images;
