# Install

For normal work need `node >= 7.8`

All commands need run from project root directory.

Install imagemagick-native:

```
sudo apt-get install libmagick++-dev

ln -s `ls /usr/lib/\`uname -m\`-linux-gnu/ImageMagick-*/bin-q16/Magick++-config | head -n 1` /usr/local/bin/
```

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
./bin/db2json.js 
```
All old data will be deleted.



# Build Static Sity

First you need export database.
Than you can build sity with *gulp*:
```
 ./node_modules/.bin/gulp
```



# Run Static Sity

From project root directory run:
```
./bin/sity.sh
```

After open in your browser `http://localhost:9002`



