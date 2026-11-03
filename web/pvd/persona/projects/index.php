<?php
/**
 * Fichero de inicio del modulo
 *
 * @author    Yoandry Morejon Borbon
 * @copyright UCID-ERP Cuba
 * @version   1.0-0
 */

//Direccion de la servidora
$dir_index = __FILE__;

//Direccion del fichero de configuracion
$config_file = substr($dir_index, 0, strrpos($dir_index, 'web')) . 'apps/seguridad/config.php';

if (!file_exists($config_file)) //Si no existe el fichero de configuracion
{
    //Se dispara una excepcion
    throw new Exception('El fichero de configuracion no existe');
} elseif (!is_readable($config_file)) //Si no se puede leer
{
    //Se dispara una excepcion
    throw new Exception('No se pudo leer el fichero de configuracion. Acceso denegado.');
} else //Si existe el fichero y se puede leer
{
    //Se inicializa la variable de configuración
    $config = array();

    //Se incluye el fichero
    include_once($config_file);

    if (!isset($config['include_path'])) {
        throw new Exception('El framework no esta configurado correctamente.');
    }

    //Direccion de la carpeta de publicacion
    $dir_www = $_SERVER['DOCUMENT_ROOT'];
    //Direccion del Marco de trabajo relativa a la carpeta de publicacion.
    $dir_rel_mt = '/';
    //Direccion absoluta del marco de trabajo
    $dir_abs_mt = str_replace('//', '/', dirname($dir_www . '..') . '/' . $dir_rel_mt);
    $config['include_path'] .= '' . PATH_SEPARATOR . $dir_abs_mt . 'apps/pvd/persona/models/domain/generated';
    $config['include_path'] .= '' . PATH_SEPARATOR . $dir_abs_mt . 'apps/pvd/persona/models/domain';
    $config['include_path'] .= '' . PATH_SEPARATOR . $dir_abs_mt . 'apps/pvd/persona/models/bussines';
    $config['include_path'] .= '' . PATH_SEPARATOR . $dir_abs_mt . 'apps/pvd/persona/services';

    //Se inicializa el include path de php a partir de la variable de configuracion
    set_include_path($config['include_path']);

    //Se inicia la carga automatica de clases y ficheros
    $loader_file = 'Zend/Loader/Autoloader.php';

    if (!@include_once($loader_file)) {
        throw new Exception('El framework no esta configurado correctamente.');
    }
    $autoloader = Zend_Loader_Autoloader::getInstance();
    $autoloader->setFallbackAutoloader(true);

    //Se inicia la aplicacion
    $app = new ZendExt_App();
    $app->init($config);
}
