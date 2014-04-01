#!/bin/bash

usage() {
	echo "Usage:"
	echo "  lv.sh [server-mode, e.g. development, staging, production]"
	echo "Also, ensure that forever and node are both available in the path"
	exit 1 
}

if [ $# -eq 1 ]
then
	# Set up variables
	FOREVER_BIN="$(which forever 2> /dev/null)"
	NODE_BIN="$(which node 2> /dev/null)"

	# Check path
	if [ -z "$FOREVER_BIN" ]
	then
		echo "ERROR - forever must be on path"
		usage
		exit 1
	fi

	# Start server
	echo Starting server in $(pwd)...
	$FOREVER_BIN start -l $(pwd)/logs/forever.log -a -w --watchIgnore "*.log" $NODE_BIN lv.js $2 
else
	usage
fi
