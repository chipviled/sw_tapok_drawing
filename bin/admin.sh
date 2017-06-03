#!/usr/bin/env bash

# cat ./sql/database.sql | sqlite3 ./cache/database.db

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

node ${DIR}/../node_modules/express-admin/app.js ${DIR}/../config/admin/
