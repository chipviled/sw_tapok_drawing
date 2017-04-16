# Install

For normal work need `node >= 6.0`

All commands need run from project root directory.

Install need node modules:
```
npm install
```
Create temp empty database:
```
cat ./sql/database.sql | sqlite3 ./cache/database.db
```


# Run Admin

From project root directory run:
```
./bin/admin
```

After open in your browser `http://localhost:9001`

login: **admin**

password: **adminADMIN111**

It's local admin for comfortable working with local data only.
**Do NOT use in production.**
