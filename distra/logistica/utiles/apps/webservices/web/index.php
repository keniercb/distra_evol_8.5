<?php

require_once __DIR__ . '/../vendor/autoload.php';

define("ROOT_PATH", __DIR__ . "/..");

$app = new Silex\Application();


require __DIR__.'/../app/config/config.php';

require __DIR__.'/../app/config/parameters.php';

//require __DIR__.'/../app/routes.php';

require __DIR__.'/../app/providers.php';


//require __DIR__.'/../src/routes.php';

require __DIR__. '/../src/app.php';

$app['http_cache']->run();
