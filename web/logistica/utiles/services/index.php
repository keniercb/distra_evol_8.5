<?php
/**
 * Created by PhpStorm.
 * User: keniercb
 * Date: 28/11/16
 * Time: 10:39
 */

$dir_index = $_SERVER['SCRIPT_FILENAME'];

//Direccion del fichero de configuracion
$config_file = substr($dir_index, 0, strrpos($dir_index, 'web/')) . 'apps/logistica/utiles/comun/config_service.php';

if (!file_exists($config_file)) { //Si no existe el fichero de configuracion
    //Se dispara una excepcion
    throw new Exception('El fichero de configuracion no existe');
} elseif (!is_readable($config_file)) { //Si no se puede leer
    //Se dispara una excepcion
    throw new Exception('No se pudo leer el fichero de configuracion. Acceso denegado.');
} else {
  //Si existe el fichero y se puede leer
    //Se incluye el fichero
    include_once ($config_file);
    if (!isset($config['include_path']))
        throw new Exception('El framework no esta configurado correctamente.');
    //Se inicializa el include path de php a partir de la variable de configuracion
    set_include_path($config['include_path']);
    //Se inicia la carga automatica de clases y ficheros
    $loader_file = 'Zend/Loader/Autoloader.php';
    if (!@include_once($loader_file))
        throw new Exception('El framework no esta configurado correctamente.');
    $autoloader = Zend_Loader_Autoloader::getInstance();
    $autoloader->setFallbackAutoloader(true);
 	
    define("ROOT_PATH",'apps/logistica/utiles/webservices');
    $config_file_webservices = substr($dir_index, 0, strrpos($dir_index, 'web/'))  . ROOT_PATH . '/vendor/autoload.php';


    if (!file_exists($config_file_webservices)) {
        throw new Exception('El fichero de configuracion del webservices no existe');
    } elseif (!is_readable($config_file_webservices)) {
        throw new Exception('No se pudo leer el fichero de configuracion del webservices. Acceso denegado.');
    } else {
        try{
            require_once $config_file_webservices;
        }catch (Exception $e){
            print_r($e);
        }
    }
}