CREATE TABLE public.rolling_point
(
    rolling_point_id SERIAL,
    point_time_rolling_point text COLLATE pg_catalog."default",
    gps_lat double precision,
    gps_long double precision,
    trip_id integer,
    CONSTRAINT rolling_point_pkey PRIMARY KEY (rolling_point_id),
    CONSTRAINT fk_event_trip FOREIGN KEY (trip_id)
        REFERENCES public.trip (trip_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;
