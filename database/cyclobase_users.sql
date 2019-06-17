CREATE TABLE cyclobase_users (
   ID serial PRIMARY KEY,
   login VARCHAR (255) NOT NULL,
   password VARCHAR (255) NOT NULL,
   activated BOOLEAN NOT NULL DEFAULT TRUE;
);
