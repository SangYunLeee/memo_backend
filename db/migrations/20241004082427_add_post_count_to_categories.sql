-- migrate:up
ALTER TABLE categories ADD COLUMN post_count integer DEFAULT 0;

-- Step 1: 모든 카테고리의 post_count 초기화
UPDATE categories
SET post_count = 0;

-- Step 2: 카테고리별로 게시물 수를 계산하고 post_count 컬럼 업데이트
UPDATE categories
SET post_count = (
  SELECT COUNT(*)
  FROM posts
  WHERE posts.cate_id = categories.id
);

-- migrate:down
ALTER TABLE categories DROP COLUMN post_count;
