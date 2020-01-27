CREATE TABLE public.rolling_point
(
    rolling_point_id SERIAL,
    point_time_rolling_point text COLLATE pg_catalog."default",
    gps_lat double precision,
    gps_long double precision,
    CONSTRAINT rolling_point_pkey PRIMARY KEY (rolling_point_id)

)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;
