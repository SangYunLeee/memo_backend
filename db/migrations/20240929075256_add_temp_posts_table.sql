-- migrate:up
-- temp_posts 테이블 생성
CREATE TABLE temp_posts (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL,
  title VARCHAR(300) NOT NULL,
  content_slate VARCHAR(6000),
  CONSTRAINT fk_temp_posts_posts FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- migrate:down
-- temp_posts 테이블 삭제
DROP TABLE temp_posts;
