#!/usr/bin/env bash

DIR=$( dirname "$0" )/../
ROOTDIR=$( realpath "$DIR" )
CSVDIR=${ROOTDIR}/public/csv
DB=${ROOTDIR}/cache/database.db
SQL=${ROOTDIR}/sql/database.sql
TABLES=('picture' 'users' 'iteration' 'achivement' 'user_achivement')


while true ; do
read -p "Import from CSV to DB. All information in DB will be lost. Continue? " YN
case $YN in

[Yy]* )

echo "Begin import from CSV."

rm "$DB"
cat "$SQL" | sqlite3 "$DB"

for I in ${TABLES[*]}; do
	echo "  $I"
echo -e ".mode quote \n.import ${CSVDIR}/${I}.csv $I" | sqlite3 -csv "$DB"
done

echo "End."

break ;;

[Nn]* ) 
echo 'Stop.'
exit ;;
* ) echo "y or n.";;
esac
done
