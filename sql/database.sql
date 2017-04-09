-- Create tables.

CREATE TABLE picture
( id INTEGER,
  title VARCHAR NOT NULL,
  description VARCHAR,
  file_path VARCHAR,
  file_name VARCHAR,
  file_size VARCHAR,
  pict_width INTEGER,
  pict_height INTEGER,
  user_id INTEGER,
  keywords VARCHAR,
  vote INTEGER,
  vote_users VARCHAR,
  iteration_id INTEGER,
  created_at DATE,
  updated_at DATE,
  CONSTRAINT id_pk PRIMARY KEY (id)
);

CREATE TABLE users
( id INTEGER,
  name VARCHAR NOT NULL,
  sity_id INTEGER,
  CONSTRAINT id_pk PRIMARY KEY (id)
);

CREATE TABLE iteration
( id INTEGER,
  date_begin DATE,
  date_end DATE,
  theme VARCHAR NOT NULL,
  theme_user_id INTEGER,
  win_user_id INTEGER,
  description VARCHAR,
  CONSTRAINT id_pk PRIMARY KEY (id)
);

CREATE TABLE achivement
( id INTEGER,
  title VARCHAR,
  description VARCHAR,
  image VARCHAR,
  CONSTRAINT id_pk PRIMARY KEY (id)
);

CREATE TABLE user_achivement
( user_id INTEGER NOT NULL,
  achivement_id INTEGER NOT NULL,
  CONSTRAINT id_pk PRIMARY KEY (user_id, achivement_id)
);



