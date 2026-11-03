<?php

/**
 * Fichero de configuracion del modulo Contabilización.
 * 
 * @author Ing. Rodain Terrer Molina
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
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/modeloscontabilizacion'
        . '/gestcamposcontables/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/modeloscontabilizacion'
        . '/gestcamposcontables/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/modeloscontabilizacion'
        . '/gestcamposcontables/models/domain';

$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/modeloscontabilizacion'
        . '/gestclasificadores/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/modeloscontabilizacion'
        . '/gestclasificadores/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/modeloscontabilizacion'
        . '/gestclasificadores/models/domain';

$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/modeloscontabilizacion'
        . '/gestmodelos/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/modeloscontabilizacion'
        . '/gestmodelos/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/modeloscontabilizacion'
        . '/gestmodelos/models/domain';

$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/modeloscontabilizacion'
        . '/gestvalorescontables/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/modeloscontabilizacion'
        . '/gestvalorescontables/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/modeloscontabilizacion'
        . '/gestvalorescontables/models/domain';

$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/modeloscontabilizacion'
        . '/operaciones/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/modeloscontabilizacion'
        . '/operaciones/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/modeloscontabilizacion'
        . '/operaciones/models/domain';

$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/modeloscontabilizacion'
        . '/gestoperaciones/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/modeloscontabilizacion'
        . '/gestoperaciones/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/modeloscontabilizacion'
        . '/gestoperaciones/models/domain';

$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/comun/util';


