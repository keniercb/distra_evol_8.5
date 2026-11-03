<?php

/**
 * @autor Equipo de Arquitectura UCID
 *
 * @package    Amqp
 * @subpackage Worker
 * @version    1.0
 */
$arrayArguments = $_SERVER['argv'];
$id_process = $arrayArguments[1];
$workerName = $arrayArguments[2];
$workerReference = $arrayArguments[3];
$arguments = json_decode(stripslashes($arrayArguments[4]));
$task_name = $arrayArguments[5];
if (isset($_SERVER['PWD']))
    $dir_index = $_SERVER['PWD'];
else
    $dir_index = $_SERVER['SCRIPT_FILENAME'];
//Se carga el fichero de configuracion del componente pasado por parametro
$dir_MT = substr($dir_index, 0, strrpos($dir_index, 'lib'));
$dir_config = $dir_MT . $workerReference . DIRECTORY_SEPARATOR . 'comun' . DIRECTORY_SEPARATOR . 'config.php';

if (file_exists($dir_config))
    $config_file = $dir_config;
else
    $config_file = $dir_MT . 'apps' . DIRECTORY_SEPARATOR . 'comun' . DIRECTORY_SEPARATOR . 'config.php';

if (!is_readable($config_file)) {
    throw new Exception('No se pudo leer el fichero de configuracion. Acceso denegado.');
} else {
    //Se inicializa la variable de configuración
    $config = array();

    //Se incluye el fichero de configuracion.
    include_once ($config_file);
    if (!isset($config['include_path']))
        throw new Exception('El framework no esta configurado correctamente.');

    //Se inicializa el include path de php a partir de la variable de configuracion
    set_include_path($config['include_path']);

    //Se realiza la autocarga de las clases de Zend
    $loader_file = $dir_MT . 'lib' . DIRECTORY_SEPARATOR . 'Zend' . DIRECTORY_SEPARATOR . 'Loader' . DIRECTORY_SEPARATOR . 'Autoloader.php';
    if (!@include_once($loader_file))
        throw new Exception('El framework no esta configurado correctamente.');
    $autoloader = Zend_Loader_Autoloader :: getInstance();
    $autoloader->setFallbackAutoloader(true);


    //Se inicia la configuracion de la aplicacion
    $app = new ZendExt_App_Cli();
    $app->init($config);
    Zend_Registry :: getInstance()->idusuario = end($arguments->arguments);
    $workerObject = new $workerName($id_process, $task_name);
    $workerObject->_work($arguments->arguments);
    $app->finish();
}