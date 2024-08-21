-- migrate:up
-- 기존의 upload_date를 created_at으로 이름 변경
ALTER TABLE files
RENAME COLUMN upload_date TO created_at;

-- post_id 열에서 NOT NULL 제약 조건 제거
ALTER TABLE files
ALTER COLUMN post_id DROP NOT NULL;


-- migrate:down
-- created_at을 다시 upload_date로 이름 변경
ALTER TABLE files
RENAME COLUMN created_at TO upload_date;

-- post_id 열에 NOT NULL 제약 조건 다시 추가
ALTER TABLE files
ALTER COLUMN post_id SET NOT NULL;
