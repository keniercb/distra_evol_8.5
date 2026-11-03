<?php
/**
 * Fichero de inicio del modulo de gestion del Portal
 *
 * @author Yoandry Morejon Borbon
 * @copyright UCID-ERP Cuba
 * @version 1.0-0
 */
//Direccion de la servidora


if (isset($_REQUEST['datas'])) {
    $dir_index = $_SERVER['SCRIPT_FILENAME'];
    $config_file_edi = substr($dir_index, 0, strrpos($dir_index, 'web')) . 'lib/EdiFact/autoload.php';
    if (!file_exists($config_file_edi)) {
        throw new Exception('El fichero de configuracion del EDIFACT no existe');
    } elseif (!is_readable($config_file_edi)) {
        throw new Exception('No se pudo leer el fichero de configuracion del EDIFACT. Acceso denegado.');
    } else {
        require_once $config_file_edi;
    }
  //Direccion del fichero de configuracion
    $config_file = substr($dir_index, 0, strrpos($dir_index, 'web')) . 'apps/logistica/utiles/comun/config.php';

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
        //Se incluye el fichero
        include_once($config_file);

        if (!isset($config['include_path']))
            throw new Exception('El framework no esta configurado correctamente.');
        //Se inicializa el include path de php a partir de la variable de configuracion
        set_include_path($config['include_path']);

        //Se inicia la carga automatica de clases y ficheros
        $loader_file = 'Zend/Loader.php';
        if (!@include_once($loader_file))
            throw new Exception('El framework no esta configurado correctamente.');
        Zend_Loader::registerAutoload();
        //Se inicia la aplicacion
        $app = new ZendExt_App();
        $app->init($config);
    }

} else {
    echo 'Mensaje: </br>';
    echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
    echo '&nbsp;&nbsp;' . 'Parametros vacios';
    echo '</pre>' . '</br>';
    echo 'Detalles:';
    echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
    print_r('Parametros vacios');
    echo '</pre>';
}