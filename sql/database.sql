CREATE TABLE picture
( id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  file VARCHAT(1),
  file_path TEXT,
  file_name TEXT,
  file_size TEXT,
  pict_width INTEGER,
  pict_height INTEGER,
  is_voted BOOLEAN DEFAULT TRUE,
  user_id INTEGER NOT NULL,
  keywords TEXT,
  vote INTEGER NOT NULL DEFAULT 0,
--  vote_users TEXT,
  iteration_id INTEGER,
  created_at DATE,
  updated_at DATE
);

CREATE TABLE users
( id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sity_id INTEGER NOT NULL,
  CONSTRAINT name_unique UNIQUE (name)
);

CREATE TABLE iteration
( id INTEGER PRIMARY KEY AUTOINCREMENT,
  date_begin DATETIME,
  date_end DATETIME,
  theme TEXT NOT NULL,
  theme_user_id INTEGER NOT NULL,
  win_user_id INTEGER,
  description TEXT
);

CREATE TABLE achivement
( id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT
);

CREATE TABLE user_achivement
( user_id INTEGER NOT NULL,
  achivement_id INTEGER NOT NULL,
  CONSTRAINT id_pk PRIMARY KEY (user_id, achivement_id)
);

CREATE TABLE user_vote
( user_id INTEGER NOT NULL,
  vote_id INTEGER NOT NULL,
  CONSTRAINT id_pk PRIMARY KEY (user_id, vote_id)
);


