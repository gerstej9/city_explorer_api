DROP TABLE location;

CREATE TABLE location (
  id SERIAL PRIMARY KEY,
  search_query VARCHAR(255),
  latitude NUMERIC(7, 4),
  longitude NUMERIC(7, 4)
);