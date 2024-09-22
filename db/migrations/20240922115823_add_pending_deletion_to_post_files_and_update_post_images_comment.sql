-- migrate:up
-- post_images 테이블의 is_thumbnail 컬럼 설명 변경
COMMENT ON COLUMN post_images.is_thumbnail IS '임시 파일 여부';

-- post_files 테이블에 pending_deletion 컬럼 추가
ALTER TABLE post_files ADD COLUMN pending_deletion BOOLEAN NOT NULL DEFAULT FALSE;

-- migrate:down
-- post_images 테이블의 is_thumbnail 컬럼 설명 원복
COMMENT ON COLUMN post_images.is_thumbnail IS NULL;

-- post_files 테이블에서 pending_deletion 컬럼 제거
ALTER TABLE post_files DROP COLUMN pending_deletion;
