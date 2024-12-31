-- migrate:up
-- posts 테이블에 cate_id 인덱스 추가
CREATE INDEX posts_cate_id_idx ON posts(cate_id);

-- comments 테이블에 updated_at 컬럼 추가
ALTER TABLE comments ADD COLUMN updated_at timestamp NOT NULL DEFAULT now();

-- comments 테이블의 외래키 제약조건 수정
ALTER TABLE comments
  DROP CONSTRAINT IF EXISTS comments_posts_id_fkey,
  DROP CONSTRAINT IF EXISTS comments_users_id_fkey;

ALTER TABLE comments
  ADD CONSTRAINT comments_posts_id_fkey
    FOREIGN KEY (posts_id)
    REFERENCES posts(id)
    ON DELETE SET NULL;

ALTER TABLE comments
  ADD CONSTRAINT comments_users_id_fkey
    FOREIGN KEY (users_id)
    REFERENCES users(id)
    ON DELETE SET NULL;

-- migrate:down
-- comments 테이블의 외래키 제약조건 원복
ALTER TABLE comments
  DROP CONSTRAINT IF EXISTS comments_posts_id_fkey,
  DROP CONSTRAINT IF EXISTS comments_users_id_fkey;

ALTER TABLE comments
  ADD CONSTRAINT comments_posts_id_fkey
    FOREIGN KEY (posts_id)
    REFERENCES posts(id);

ALTER TABLE comments
  ADD CONSTRAINT comments_users_id_fkey
    FOREIGN KEY (users_id)
    REFERENCES users(id);

-- comments 테이블에서 updated_at 컬럼 제거
ALTER TABLE comments DROP COLUMN updated_at;

-- posts 테이블의 cate_id 인덱스 제거
DROP INDEX posts_cate_id_idx;
