#!/bin/sh -e

#
SCRIPT_NAME="consumer_task.php"
SCRIPT_PATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
PHP_BIN="/opt/stack-xetid-mt/php/bin/php"
#
MT_DIR="$( cd "$(dirname "$0")/../../.." >/dev/null 2>&1 ; pwd -P )"
LOG_DIR="$MT_DIR/log"
LOG_NAME="zeolides_amqp_consumer_task"

cd $SCRIPT_PATH
$PHP_BIN $SCRIPT_NAME >> $LOG_DIR/$LOG_NAME 2>&1
