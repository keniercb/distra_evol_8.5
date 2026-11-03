<?php
spl_autoload_register(null, false);
define('JASPERCLIENT_BASE_PATH', __DIR__ . '/class/');
spl_autoload_register(function($className) {
    $fileName = JASPERCLIENT_BASE_PATH . $className . '.php';
    $fileName = str_replace('\\', '/', $fileName);
    if (is_readable($fileName)) {
        require_once $fileName;
    }
});
