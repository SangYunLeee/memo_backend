-- migrate:up
-- users 테이블
ALTER TABLE users
ALTER COLUMN created_at TYPE timestamptz;

-- posts 테이블
ALTER TABLE posts
ALTER COLUMN created_at TYPE timestamptz,
ALTER COLUMN updated_at TYPE timestamptz;

-- temp_posts 테이블
ALTER TABLE temp_posts
ALTER COLUMN created_at TYPE timestamptz,
ALTER COLUMN updated_at TYPE timestamptz;

-- comments 테이블
ALTER TABLE comments
ALTER COLUMN created_at TYPE timestamptz,
ALTER COLUMN updated_at TYPE timestamptz;

-- user_files 테이블
ALTER TABLE user_files
ALTER COLUMN created_at TYPE timestamptz;

-- post_images 테이블
ALTER TABLE post_images
ALTER COLUMN created_at TYPE timestamptz;

-- post_files 테이블
ALTER TABLE post_files
ALTER COLUMN created_at TYPE timestamptz;

-- migrate:down
-- users 테이블
ALTER TABLE users
ALTER COLUMN created_at TYPE timestamp;

-- posts 테이블
ALTER TABLE posts
ALTER COLUMN created_at TYPE timestamp,
ALTER COLUMN updated_at TYPE timestamp;

-- temp_posts 테이블
ALTER TABLE temp_posts
ALTER COLUMN created_at TYPE timestamp,
ALTER COLUMN updated_at TYPE timestamp;

-- comments 테이블
ALTER TABLE comments
ALTER COLUMN created_at TYPE timestamp,
ALTER COLUMN updated_at TYPE timestamp;

-- user_files 테이블
ALTER TABLE user_files
ALTER COLUMN created_at TYPE timestamp;

-- post_images 테이블
ALTER TABLE post_images
ALTER COLUMN created_at TYPE timestamp;

-- post_files 테이블
ALTER TABLE post_files
ALTER COLUMN created_at TYPE timestamp;
