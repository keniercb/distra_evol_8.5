<?php
use Silex\Provider\HttpCacheServiceProvider;
use Silex\Provider\DoctrineServiceProvider;
use Silex\Provider\MonologServiceProvider;
use Silex\Provider\ServiceControllerServiceProvider;
use \Euskadi31\Silex\Provider\CorsServiceProvider;
use App\Provider\AuthServiceProvider;
use Carbon\Carbon;

$app->register(new CorsServiceProvider(), array(
    'cors.allowOrigin' => '*', // your client application
    'cors.exposeHeaders' => 'X-Total-Count', // ng-admin read this header
));

$app->register(new ServiceControllerServiceProvider());

$app->register(new DoctrineServiceProvider(), array(
    "db.options" => $app["db.options"]
));

$app->register(new AuthServiceProvider());


$app->register(new HttpCacheServiceProvider(), array("http_cache.cache_dir" => ROOT_PATH . "/storage/cache",));

$app->register(new MonologServiceProvider(), array(
    "monolog.logfile" => ROOT_PATH . "/storage/logs/" .$app['environment'].'/'. Carbon::now('Europe/London')->format("Y-m-d") . ".log",
    "monolog.level" => $app["log.level"],
    "monolog.name" => "application"
));