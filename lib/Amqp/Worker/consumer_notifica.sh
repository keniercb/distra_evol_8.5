#!/bin/sh -e

cd /var/www/marco/lib/Amqp/Worker/
php consumer_notifica.php 2>&1 $1 $2
