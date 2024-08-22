-- migrate:up
-- Step 1: post_files 테이블에 is_temporary 컬럼 추가
ALTER TABLE post_files
ADD COLUMN is_temporary boolean NOT NULL DEFAULT true;

-- migrate:down
-- Step 1: post_files 테이블에서 is_temporary 컬럼 제거
ALTER TABLE post_files
DROP COLUMN is_temporary;
