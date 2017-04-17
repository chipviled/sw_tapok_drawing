#!/usr/bin/env bash

DIR=$( dirname "$0" )/../
ROOTDIR=$( realpath "$DIR" )
CSVDIR=${ROOTDIR}/public/csv
DB=${ROOTDIR}/cache/database.db
TABLES=('picture' 'users' 'iteration' 'achivement' 'user_achivement')


while true ; do
read -p "Export from DB to CSV. Continue? " YN
case $YN in

[Yy]* )

echo "Begin export to CSV."

mkdir -p "$CSVDIR"

for I in ${TABLES[*]}; do
	echo "  $I"
	sqlite3 -noheader -csv "$DB" "select * from $I;" > "$CSVDIR/$I.csv"
done

echo "End."

break ;;

[Nn]* ) 
echo 'Stop.'
exit ;;
* ) echo "y or n.";;
esac
done
