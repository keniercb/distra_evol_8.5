<?php
$dir_index = $_SERVER['SCRIPT_FILENAME'];
//Direccion del fichero de configuracion
$dir_aplication = substr($dir_index, 0, strrpos($dir_index, '/web/')) . '/apps/';
$config_file = $dir_aplication . 'comun/config_service.php';
include_once($config_file);
//Clases comunes de configuracion
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comun/helpers';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comun/helpers/facade';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comun/controllers';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comun/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comun/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/comun/models/domain/generated';

$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/configuracion/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/configuracion/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/configuracion/models/domain/generated';

$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/documento/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/documento/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/documento/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/facturacion/facturacion/factura/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/facturacion/facturacion/factura/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/facturacion/facturacion/factura/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/facturacion/facturacion/comun_fact/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/facturacion/facturacion/comun_fact/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/facturacion/facturacion/comun_fact/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/facturacion/facturacion/comun_fact/webservices';
set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);

