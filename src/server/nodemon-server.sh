#!/bin/bash
set -e
set -u

usage() {
	echo "Usage:"
	echo "  lv.sh [server-mode, e.g. development, staging, production]"
	echo "Also, ensure that nodemon is available in the path"
	exit 1 
}

if [ $# -eq 1 ]
then
	# Set up variables
	NODEMON_BIN="$(which nodemon 2> /dev/null)"
	SCRIPTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

	# Check path
	if [ -z "$NODEMON_BIN" ]
	then
		echo "ERROR - nodemon must be on path"
		usage
		exit 1
	fi

	# Start server
	cd $SCRIPTDIR
	echo Starting server in $(pwd)...
	nodemon -V --delay 3 $SCRIPTDIR/server.js $1 
else
	usage
fi
