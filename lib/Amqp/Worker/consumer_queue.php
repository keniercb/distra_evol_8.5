<?php
if (isset($_SERVER['PWD']))
    $dir_index = $_SERVER['PWD'];
else
    $dir_index = $_SERVER['SCRIPT_FILENAME'];
//Se carga el fichero de configuracion del componente pasado por parametro
$dir_MT = substr($dir_index, 0, strrpos($dir_index, 'lib'));
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
    $autoloader = Zend_Loader_Autoloader::getInstance();
    $autoloader->setFallbackAutoloader(true);

    //Se crea el registro de objetos, variables y arreglos
    $register = new Zend_Registry(array(), ArrayObject::ARRAY_AS_PROPS);
    //Se guarda el registro en el singelton de Registro
    Zend_Registry :: setInstance($register);

    //Se guarda en el singleton la configuracion del framework.
    $configApp = new ZendExt_App_Config();
    $register->config = $configApp->configApp($config);
    $workerMgr = Amqp_Worker_Mgr :: getInstance('queue');
    $workerMgr->waitTask();
}
?>