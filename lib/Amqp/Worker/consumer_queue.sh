#!/bin/sh -e

cd /var/www/html/zeolides/lib/Amqp/Worker/
php consumer_queue.php >> /var/www/html/Zeolides/mio/zeolides/log/zeolides_queue_consumer_task.log 2>&1