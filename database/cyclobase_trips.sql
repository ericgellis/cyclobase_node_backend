CREATE TABLE public.trip
(
    trip_id SERIAL PRIMARY KEY,
    end_gps_lat double precision,
    end_gps_long double precision,
    end_time bigint,
    start_gps_lat double precision,
    start_gps_long double precision,
    start_time bigint
)
