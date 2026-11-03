<?php 
/**
 * Fichero de configuracion del modulo Contabilización.
 * 
 * @author Ing. Alejandro Mengana Pérez
 * @copyright UCID-ERP Cuba
 * @version 1.0-0
 */
//Direccion de la servidora
$dirIndex = $_SERVER['SCRIPT_FILENAME'];
//Direccion del fichero de configuracion
$configFile = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/comun/config.php';
//Inclusion del Fichero de Configuracion del ERP
include($configFile);

// Inclusion del fichero con las funciones personalizadas
include($dir_abs_mt . 'apps/configuracion/modeloscontabilizacion/util/customFunctions.php');

set_include_path($config['include_path']);

//Inicializando el include path de php a partir de la variable de configuracion
/*$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/modeloscontabilizacion'
        . '/gestcamposcontables/models/bussines';*/
