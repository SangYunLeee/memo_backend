-- migrate:up
-- "categories" 테이블에 "parent_cate_id" 컬럼 추가
ALTER TABLE "categories" ADD COLUMN "parent_cate_id" integer;
-- "categories" 테이블에 "parent_cate_id" 외래 키 제약 조건 추가
ALTER TABLE "categories" ADD FOREIGN KEY ("parent_cate_id") REFERENCES "categories" ("id");
-- "categories" 테이블에서 ("users_id", "pos") 인덱스 삭제
DROP INDEX IF EXISTS "categories_users_id_pos_idx";
-- "categories" 테이블에서 ("users_id", "category_name") 인덱스 삭제
DROP INDEX IF EXISTS "categories_users_id_category_name_idx";

-- migrate:down
-- "categories" 테이블에서 "parent_cate_id" 외래 키 제약 조건 제거
ALTER TABLE "categories" DROP CONSTRAINT "categories_parent_cate_id_fkey";
-- "categories" 테이블에서 "parent_cate_id" 컬럼 삭제
ALTER TABLE "categories" DROP COLUMN "parent_cate_id";
-- "categories" 테이블에 ("users_id", "pos") 유니크 인덱스 추가
CREATE UNIQUE INDEX "categories_users_id_pos_idx" ON "categories" ("users_id", "pos");
-- "categories" 테이블에 ("users_id", "category_name") 유니크 인덱스 추가
CREATE UNIQUE INDEX "categories_users_id_category_name_idx" ON "categories" ("users_id", "category_name");
