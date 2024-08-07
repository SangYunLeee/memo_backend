-- migrate:up
CREATE TABLE "files" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "original_filename" VARCHAR(255) NOT NULL,
  "stored_filename" VARCHAR(255) NOT NULL,
  "file_size" BIGINT NOT NULL,
  "mime_type" VARCHAR(100),
  "upload_date" TIMESTAMP NOT NULL DEFAULT (now()),
  "post_id" INTEGER NOT NULL,
  "user_id" INTEGER,
  "file_path" VARCHAR(1000) NOT NULL,
  "description" TEXT
);

ALTER TABLE "files" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id");

ALTER TABLE "files" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

-- migrate:down

-- 1. "files" 테이블에서 "post_id" 외래 키 제약 조건 제거
ALTER TABLE "files" DROP CONSTRAINT IF EXISTS "files_post_id_fkey";

-- 2. "files" 테이블에서 "user_id" 외래 키 제약 조건 제거
ALTER TABLE "files" DROP CONSTRAINT IF EXISTS "files_user_id_fkey";

-- 3. "files" 테이블 삭제
DROP TABLE IF EXISTS "files";
