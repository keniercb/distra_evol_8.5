<?php

// Prod CONFIGURATION
$app['environment'] = "prod";
$app['debug'] = false;
$app['log.level'] = Monolog\Logger::ERROR;
$app['api.version'] = "v1";
$app['api.endpoint'] = "/api";
$app['api'] = '/api/v1';
