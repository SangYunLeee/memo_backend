-- migrate:up
ALTER TABLE user_files
ADD COLUMN pending_deletion BOOLEAN NOT NULL DEFAULT FALSE;

-- migrate:down
ALTER TABLE user_files
DROP COLUMN IF EXISTS pending_deletion;
