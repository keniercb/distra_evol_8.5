<?php

function log_autoload($className) {
    $filename = dirname(__FILE__)."/".str_replace('\\', '/', $className) . ".php";
        if (file_exists($filename)) {
            include($filename);
            if (class_exists($className)) {
                return TRUE;
            }
        }
        return FALSE;
    }

spl_autoload_register('log_autoload');
