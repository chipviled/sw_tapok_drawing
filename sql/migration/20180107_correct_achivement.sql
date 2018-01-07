-- UPDATE: 20180107 correct achivement.

CREATE TABLE user_achivement_tmp (
    user_id       INTEGER NOT NULL,
    achivement_id INTEGER NOT NULL,
    CONSTRAINT id_pk PRIMARY KEY (
        user_id,
        achivement_id
    )
);

INSERT INTO user_achivement_tmp SELECT 
  user_id,
  achivement_id
FROM
  (
    SELECT 
      achivement_id AS user_id,
      user_id AS achivement_id
    FROM user_achivement
  );

DROP TABLE user_achivement;

ALTER TABLE user_achivement_tmp RENAME TO user_achivement;
