<?php

/**
 * Fichero de configuracion del modulo de gestion del Portal
 *
 * @author  Equipo Aquitectura ERP-CUBA, Grupo I+D UCID
 * @version 1.0-0
 */
//Direccion de la servidora
$dir_index = $_SERVER['SCRIPT_FILENAME'];
//Direccion del fichero de configuracion
$config_file = substr($dir_index, 0, strrpos($dir_index, 'web')) . 'apps/comun/config.php';
//$config_file_nomencladoresGenerales = substr ($dir_index, 0, strrpos ($dir_index, 'web')) . 'apps/configuracion/nomencladores/config.php';
//Inclusion del Fichero de Configuracion del ERP
include($config_file);
//include($config_file_nomencladoresGenerales);

set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
//Clases comunes logistica
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comun/controllers';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comun/helpers';

$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comun/helpers/facade';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comun/helpers/jwt';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comun/views';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comun/views/scripts';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comun/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comun/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comun/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comun/validators';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comun/services';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comun/variablesglobales/models/bussines';

//EAN
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comun/helpers/barcodegen/core';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comun/helpers/barcodegen/drawer';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comun/helpers/barcodegen/code';
//EAN

$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/comun/models/bussines';
//Carpertas incluidas temporalmente
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/configuracion/controllers';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/configuracion/views/scripts';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/configuracion/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/configuracion/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/configuracion/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/configuracion/validators';

$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/nomencladores/controllers';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/nomencladores/views/scripts';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/nomencladores/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/nomencladores/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/nomencladores/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/nomencladores/validators';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/nomencladores/services';

$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comprobante/controllers';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comprobante/views/scripts';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comprobante/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comprobante/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comprobante/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comprobante/validators';

$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/documento/controllers';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/documento/views/scripts';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/documento/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/documento/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/documento/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/documento/validators';

$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/producto/controllers';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/producto/views/scripts';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/producto/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/producto/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/producto/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/producto/validators';

$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/reportes/controllers';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/reportes/models';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/reportes/services';

$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/maestroproductos/controllers';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/maestroproductos/views/scripts';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/maestroproductos/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/maestroproductos/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/maestroproductos/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/maestroproductos/validators';


$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'lib/Adapters/PHPExcel/1.8.0';
//$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/pvd/comun/models/bussines/';

