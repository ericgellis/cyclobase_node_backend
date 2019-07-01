CREATE TABLE public.rolling_point
(
    rolling_point_id SERIAL PRIMARY KEY,
    gps_lat double precision,
    gps_long double precision,
    point_time bigint,
    trip_id bigint,
    CONSTRAINT fk_rollingpoint_trip FOREIGN KEY (trip_id)
        REFERENCES public.trip (trip_id) MATCH SIMPLE
        ON DELETE CASCADE
)
