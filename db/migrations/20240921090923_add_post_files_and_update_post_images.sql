-- migrate:up
-- post_images 테이블에서 is_temporary 컬럼 제거
ALTER TABLE post_images DROP COLUMN is_temporary;

-- post_files 테이블 생성
CREATE TABLE post_files (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  post_id integer REFERENCES posts(id) ON DELETE SET NULL,
  original_filename varchar(255) NOT NULL,
  stored_filename varchar(255) NOT NULL,
  file_size bigint NOT NULL,
  mime_type varchar(100),
  created_at timestamp NOT NULL DEFAULT now(),
  file_path varchar(1000) NOT NULL
);

-- migrate:down
-- post_images 테이블에 is_temporary 컬럼 추가
ALTER TABLE post_images ADD COLUMN is_temporary boolean NOT NULL DEFAULT true;

-- post_files 테이블 삭제
DROP TABLE post_files;
