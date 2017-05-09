#!/usr/bin/env node

const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const mkdirp = require('mkdirp');

const rootDir = __dirname + '/../';
const dbFile = rootDir + 'cache/database.db';
const jsonDIR = rootDir + 'public/json/';
const tables = [
    'picture',
    'users',
    'iteration',
    'achivement',
    'user_achivement',
    'user_vote'
];

mkdirp.sync(jsonDIR);

var db = new sqlite3.Database(dbFile);

tables.forEach(function (element, index) {
    db.all('SELECT * FROM ' + element, {}, function(err, rows){
        console.log(' ', element);
        fs.writeFileSync(
                jsonDIR + element + '.json', 
                JSON.stringify(rows, null, ' '),
                'binary'
            );
    });
});

