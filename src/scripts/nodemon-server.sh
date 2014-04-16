#!/bin/bash
set -e
set -u

usage() {
	echo "Usage:"
	echo "  lv.sh [server-mode, e.g. dev, staging, prod]"
	echo "Also, ensure that nodemon is available in the path"
	exit 1 
}

if [ $# -eq 1 ]
then
	# Set up variables
	MODE=$1
	NODEMON_BIN="$(which nodemon 2> /dev/null)"
	SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
	SERVER_DIR=$SCRIPT_DIR/../server

	# Check path
	if [ -z "$NODEMON_BIN" ]
	then
		echo "ERROR - nodemon must be on path"
		usage
		exit 1
	fi

	# Start server
	cd $SERVER_DIR
	echo Starting server in $(pwd)...
	nodemon --delay 3 $SERVER_DIR/server.js $MODE 
else
	usage
fi
