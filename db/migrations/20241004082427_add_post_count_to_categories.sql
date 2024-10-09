-- migrate:up
ALTER TABLE categories ADD COLUMN post_count integer DEFAULT 0;
ALTER TABLE categories ADD COLUMN temp_post_count integer DEFAULT 0;

-- Step 1: 모든 카테고리의 post_count 초기화
UPDATE categories
SET post_count = 0;

UPDATE categories
SET temp_post_count = 0;

-- Step 2: 카테고리별로 게시물 수를 계산하고 post_count 컬럼 업데이트
UPDATE categories
SET post_count = (
  SELECT COUNT(*)
  FROM posts
  WHERE posts.cate_id = categories.id AND posts.status_id = 2
);

UPDATE categories
SET temp_post_count = (
  SELECT COUNT(*)
  FROM posts
  WHERE posts.cate_id = categories.id AND posts.status_id = 1
);

-- migrate:down
ALTER TABLE categories DROP COLUMN post_count;
ALTER TABLE categories DROP COLUMN temp_post_count;
