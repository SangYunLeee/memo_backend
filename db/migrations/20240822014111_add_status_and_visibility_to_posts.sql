-- migrate:up

-- Step 1: 새로운 post_statuses 테이블 생성
CREATE TABLE post_statuses (
  id SERIAL PRIMARY KEY,
  status_name varchar(20) NOT NULL UNIQUE
);

INSERT INTO post_statuses (status_name) VALUES ('draft'), ('published');

-- Step 2: 새로운 visibility_levels 테이블 생성
CREATE TABLE visibility_levels (
  id SERIAL PRIMARY KEY,
  level_name varchar(20) NOT NULL UNIQUE,
  description text
);

INSERT INTO visibility_levels (level_name, description) VALUES
('private', 'Only the author can view this post'),
('public', 'Anyone can view this post');

-- Step 3: posts 테이블에 status_id 및 visibility_id 필드 추가
ALTER TABLE posts
ADD COLUMN status_id integer REFERENCES post_statuses(id) DEFAULT 1,
ADD COLUMN visibility_id integer REFERENCES visibility_levels(id) DEFAULT 1;

-- Step 4: 기존 posts 테이블의 레코드에 기본 값 설정
UPDATE posts SET status_id = 1 WHERE status_id IS NULL;
UPDATE posts SET visibility_id = 1 WHERE visibility_id IS NULL;

-- migrate:down
-- Step 1: posts 테이블에서 status_id 및 visibility_id 필드 제거
ALTER TABLE posts
DROP COLUMN status_id,
DROP COLUMN visibility_id;

-- Step 2: post_statuses 테이블 삭제
DROP TABLE post_statuses;

-- Step 3: visibility_levels 테이블 삭제
DROP TABLE visibility_levels;