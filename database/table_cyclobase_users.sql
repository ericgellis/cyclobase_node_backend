CREATE TABLE public.cyclobase_users
(
    user_id SERIAL,
    username character varying(255) COLLATE pg_catalog."default" NOT NULL,
    activated boolean NOT NULL DEFAULT true,
    hash character varying(255) COLLATE pg_catalog."default" NOT NULL,
    salt character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT cyclobase_users_pkey PRIMARY KEY (user_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;
