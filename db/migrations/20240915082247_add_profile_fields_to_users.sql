-- migrate:up
ALTER TABLE users
ADD COLUMN profile_description VARCHAR(500);

COMMENT ON COLUMN users.profile_description IS '사용자 프로필 소개';

ALTER TABLE user_files
ADD COLUMN is_profile_image BOOLEAN NOT NULL DEFAULT FALSE

-- migrate:down
ALTER TABLE users
DROP COLUMN IF EXISTS profile_description;

ALTER TABLE user_files
DROP COLUMN IF EXISTS is_profile_image;
