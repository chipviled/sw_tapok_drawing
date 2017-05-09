#!/usr/bin/env node

const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const mkdirp = require('mkdirp');

const rootDir = __dirname + '/../';
const dbFile = rootDir + 'cache/database.db';
const dbShceme = rootDir + 'sql/database.sql';
const jsonDIR = rootDir + 'public/json/';
const tables = [
    'picture',
    'users',
    'iteration',
    'achivement',
    'user_achivement',
    'user_vote'
];

fs.unlinkSync(dbFile);

var db = new sqlite3.Database(dbFile);
var scheme = fs.readFileSync(dbShceme, 'utf8');

db.exec(scheme, function(){
    tables.forEach(function (element, index) {
        var file = fs.readFileSync(jsonDIR + element + '.json');
        var data = JSON.parse(file);
        
        data.forEach(function (elem) {
            var keys = Object.keys(elem).map(function(a){
                return '`' + a + '`';
            }).join();
            var prep = Object.keys(elem).map(function(a){
                return '$' + a;
            }).join();
            var stmt = "INSERT INTO " + element + " (" +keys+ ") VALUES (" +prep+ ")";
            
            var el = {};
            for (o in elem) {
                el['$'+ o] = elem[o];
            }
            db.run(stmt, el);
        });
        console.log(' >', element);
    });
    
});






