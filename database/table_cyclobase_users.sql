CREATE TABLE public.cyclobase_users
(
    user_id SERIAL,
    login character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default",
    activated boolean NOT NULL DEFAULT true,
    hash character varying(255) COLLATE pg_catalog."default",
    salt character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT cyclobase_users_pkey PRIMARY KEY (user_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;
