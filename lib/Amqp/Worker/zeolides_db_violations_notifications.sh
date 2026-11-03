#!/bin/sh -e

cd /opt/zeolides/lib/Amqp/Worker/
php zeolides_db_violations_notifications.php >> /opt/zeolides/log/zeolides_db_violations_notifications.log 2>&1
