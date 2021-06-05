DROP DATABASE prokids;
CREATE DATABASE prokids;
\c prokids;

CREATE TABLE "user" (
  "username" varchar(40) PRIMARY KEY,
  "name" varchar(60),
  "email" text,
  "password" text
);

CREATE TABLE "level" (
  "level_id" SERIAL PRIMARY KEY,
  "name" varchar(80),
  "desc" text
);

CREATE TABLE "quiz" (
  "quiz_id" SERIAL PRIMARY KEY,
  "name" text,
  "fk_level" int
);

CREATE TABLE "progress" (
  "progress_id" SERIAL PRIMARY KEY,
  "fk_quiz" int,
  "fk_user" varchar(40),
  "stars_num" smallint
);

CREATE TABLE "preference" (
  "pref_id" SERIAL PRIMARY KEY,
  "fk_user" varchar(40),
  "sound_on" boolean
);

ALTER TABLE "quiz" ADD FOREIGN KEY ("fk_level") REFERENCES "level" ("level_id");

ALTER TABLE "progress" ADD FOREIGN KEY ("fk_quiz") REFERENCES "quiz" ("quiz_id");

ALTER TABLE "progress" ADD FOREIGN KEY ("fk_user") REFERENCES "user" ("username");

ALTER TABLE "preference" ADD FOREIGN KEY ("fk_user") REFERENCES "user" ("username");
