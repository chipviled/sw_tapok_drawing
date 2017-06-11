-- UPDATE 0.001 to 0.002

CREATE TABLE picture_tmp
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
  iteration_id INTEGER,
  is_win BOOLEAN DEFAULT FALSE,
  created_at DATE,
  updated_at DATE
);

INSERT INTO picture_tmp SELECT 
  id,
  title,
  description,
  file,
  file_path,
  file_name,
  file_size,
  pict_width,
  pict_height,
  is_voted,
  user_id,
  keywords,
  vote,
  iteration_id,
  is_win,
  created_at,
  updated_at
FROM
  (
    SELECT 
      p.id,
      p.title,
      p.description,
      p.file,
      p.file_path,
      p.file_name,
      p.file_size,
      p.pict_width,
      p.pict_height,
      p.is_voted,
      p.user_id,
      p.keywords,
      p.vote,
      p.iteration_id,
      IFNULL(abs(i.win_user_id), 0) AS is_win,
      p.created_at,
      p.updated_at
    FROM picture AS p
    LEFT JOIN iteration AS i 
      ON (p.iteration_id = i.id AND p.user_id = i.win_user_id)
  );

DROP TABLE picture;

ALTER TABLE picture_tmp RENAME TO picture;

CREATE TABLE iteration_tmp
( id INTEGER PRIMARY KEY AUTOINCREMENT,
  date_begin DATETIME,
  date_end DATETIME,
  theme TEXT NOT NULL,
  theme_user_id INTEGER NOT NULL,
  description TEXT
);

INSERT INTO iteration_tmp SELECT 
  id,
  date_begin,
  date_end,
  theme,
  theme_user_id,
  description
FROM
  (
  SELECT
    id,
    date_begin,
    date_end,
    theme,
    theme_user_id,
    description
  FROM iteration
  );

DROP TABLE iteration;

ALTER TABLE iteration_tmp RENAME TO iteration;


  