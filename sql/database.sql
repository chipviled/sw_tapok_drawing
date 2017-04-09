

CREATE TABLE picture
( id INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  file_name TEXT,
  file_size TEXT,
  pict_width INTEGER,
  pict_height INTEGER,
  user_id INTEGER,
  keywords TEXT,
  vote INTEGER,
  vote_users TEXT,
  iteration_id INTEGER,
  created_at DATE,
  updated_at DATE,
  CONSTRAINT id_pk PRIMARY KEY (id)
);

CREATE TABLE users
( id INTEGER,
  name TEXT NOT NULL,
  sity_id INTEGER,
  CONSTRAINT id_pk PRIMARY KEY (id)
);

CREATE TABLE iteration
( id INTEGER,
  date_begin DATE,
  date_end DATE,
  theme TEXT NOT NULL,
  theme_user_id INTEGER,
  win_user_id INTEGER,
  description TEXT,
  CONSTRAINT id_pk PRIMARY KEY (id)
);

CREATE TABLE achivement
( id INTEGER,
  title TEXT,
  description TEXT,
  image TEXT,
  CONSTRAINT id_pk PRIMARY KEY (id)
);

CREATE TABLE user_achivement
( user_id INTEGER NOT NULL,
  achivement_id INTEGER NOT NULL,
  CONSTRAINT id_pk PRIMARY KEY (user_id, achivement_id)
);



