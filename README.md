# DEPRECATED


# Install

For normal work need `node >= 10.0`

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
./bin/admin.sh
```

After open in your browser `http://localhost:9001`

login: **admin**

password: **adminADMIN111**

It's local admin for comfortable working with local data only.
**Do NOT use in production.**



# Import/export database

For export database data to json (static sity public data) use:
```
./bin/db2json.js
```

For import data from json to database use:
```
./bin/json2db.js
```
All old data will be deleted.



# Build Static Site

First you need export database.
You can build site with *gulp*:
```
 ./node_modules/.bin/gulp --env=prod
```
or
```
 ./bin/gulp --env=prod
```



# Run Static Site

From project root directory run:
```
./bin/site.sh
```

After open in your browser `http://localhost:9002`
