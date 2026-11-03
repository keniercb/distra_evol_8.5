<?php
$dir_index = $_SERVER['SCRIPT_FILENAME'];
//Direccion del fichero de configuracion
$dir_aplication = substr($dir_index, 0, strrpos($dir_index, '/web/')) . '/apps/';
$config_file = $dir_aplication . 'comun/config_service.php';
include_once($config_file);
//Clases comunes de configuracion
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/especialidad/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/especialidad/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/especialidad/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/clientesyproveedores/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/clientesyproveedores/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/clientesyproveedores/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/comun/webservices';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/comun/util';
set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);

