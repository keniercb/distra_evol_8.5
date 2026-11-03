<?php
/**
 * Fichero de configuracion.
 *
 * @author  Equipo Aquitectura ERP-CUBA, Grupo I+D UCID
 * @version 1.0-0
 */

//Direccion de la servidora
$dir_index = $_SERVER['SCRIPT_FILENAME'];

//Direccion del dirctorio donde estan las aplicaciones
$dir_aplication = substr($dir_index, 0, strrpos($dir_index, '/web/')) . '/apps/';

//Direccion del fichero de configuracion
$config_file = $dir_aplication . 'comun/config.php';

if (!file_exists($config_file)) {//Si no existe el fichero de configuracion
    //Se dispara una excepcion
    throw new Exception('El fichero de configuracion no existe');
} elseif (!is_readable($config_file)) { //Si no se puede leer
    //Se dispara una excepcion
    throw new Exception('No se pudo leer el fichero de configuracion. Acceso denegado.');
} else { //Si existe el fichero y se puede leer
    //Se incluye el fichero
    include_once($config_file);

    $config ['dir_index'] = $dir_index;

    //Se modifica la configuracion para el caso de los servicios web (Se sustituye service por index)
    $module_reference = substr(
        $dir_index, strrpos($dir_index, 'web') + strlen('web/'),
        strlen(dirname($dir_index)) - strrpos($dir_index, 'web') - strlen('web/')
    );
    $array_module = explode('/', $module_reference);
    $config ['module_reference'] = $module_reference;
    //$config ['xml']['iocinter']  = $dir_aplication . $array_module[0] . '/comun/recursos/xml/ioc.xml';

    if (!isset($config['include_path'])) {
        throw new Exception('El framework no esta configurado correctamente.');
    }

    //Se inicializa el include path de php a partir de la variable de configuracion
    set_include_path($config['include_path']);

    //Se inicia la carga automatica de clases y ficheros
    $loader_file = 'Zend/Loader/Autoloader.php';
    if (!@include_once($loader_file)) {
        throw new Exception('El framework no esta configurado correctamente.');
    }
    $autoloader = Zend_Loader_Autoloader::getInstance();
    $autoloader->setFallbackAutoloader(true);
}
