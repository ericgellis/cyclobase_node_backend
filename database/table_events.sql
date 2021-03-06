CREATE TABLE public.event
(
    event_id SERIAL,
    end_time bigint,
    event_name character varying(255) COLLATE pg_catalog."default",
    event_type character varying(255) COLLATE pg_catalog."default",
    gps_lat_end double precision,
    gps_lat_start double precision,
    gps_long_end double precision,
    gps_long_start double precision,
    start_time bigint,
    voice_memo character varying(255) COLLATE pg_catalog."default",
    trip_id integer,

    CONSTRAINT event_pkey PRIMARY KEY (event_id),
    CONSTRAINT fk_event_trip FOREIGN KEY (trip_id)
        REFERENCES public.trip (trip_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;
