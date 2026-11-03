<?php

/**
 * Fichero de inicio del modulo
 * 
 * @author Ing. Rodain Terrer Molina
 * @copyright UCID-ERP Cuba
 * @version 1.0-0
 */
//Direccion de la servidora
$dirIndex = __FILE__;

//Direccion del fichero de configuracion
$configFile = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/configuracion/modeloscontabilizacion/config.php';

if (!file_exists($configFile)) { //Si no existe el fichero de configuracion
    //Se dispara una excepcion
    throw new Exception('El fichero de configuracion no existe');
} elseif (!is_readable($configFile)) { //Si no se puede leer
    //Se dispara una excepcion
    throw new Exception('No se pudo leer el fichero de configuracion. Acceso denegado.');
} else { //Si existe el fichero y se puede leer
    //Se inicializa la variable de configuración
    $config = array();

    //Se incluye el fichero
    include_once ($configFile);

    if (!isset($config['include_path'])) {
        throw new Exception('El framework no esta configurado correctamente.');
    }

    //Se inicializa el include path de php a partir de la variable de configuracion
    set_include_path($config['include_path']);

    //Se inicia la carga automatica de clases y ficheros
    $loader_file = 'Zend/Loader.php';
    if (!@include_once($loader_file)) {
        throw new Exception('El framework no esta configurado correctamente.');
    }
    Zend_Loader::registerAutoload();

    //Se inicia la aplicacion
    $app = new ZendExt_App();
    $app->init($config);
}
