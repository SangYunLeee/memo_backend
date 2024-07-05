CREATE TABLE "users" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "nickname" varchar(100) UNIQUE NOT NULL,
  "email" varchar(100) UNIQUE NOT NULL,
  "password" varchar(100) NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "role" varchar(10) DEFAULT ''
);

CREATE TABLE "posts" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "users_id" integer NOT NULL,
  "title" varchar(300) NOT NULL,
  "content" varchar(6000) NOT NULL,
  "cate_id" integer,
  "thumnail_img_url" varchar(1000),
  "created_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "categories" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "pos" integer,
  "users_id" integer,
  "category_name" varchar(150) NOT NULL
);

CREATE TABLE "comments" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "posts_id" integer,
  "users_id" integer,
  "content" varchar(1000) NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now())
);

CREATE UNIQUE INDEX ON "categories" ("users_id", "category_name");

CREATE UNIQUE INDEX ON "categories" ("users_id", "pos");

ALTER TABLE "posts" ADD FOREIGN KEY ("users_id") REFERENCES "users" ("id");

ALTER TABLE "posts" ADD FOREIGN KEY ("cate_id") REFERENCES "categories" ("id");

ALTER TABLE "categories" ADD FOREIGN KEY ("users_id") REFERENCES "users" ("id");

ALTER TABLE "comments" ADD FOREIGN KEY ("posts_id") REFERENCES "posts" ("id");

ALTER TABLE "comments" ADD FOREIGN KEY ("users_id") REFERENCES "users" ("id");
