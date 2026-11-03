<?php
$dir_index = $_SERVER['SCRIPT_FILENAME'];
//Direccion del fichero de configuracion
$dir_aplication = substr($dir_index, 0, strrpos($dir_index, '/web/')) . '/apps/';
$config_file = $dir_aplication . 'comun/config_service.php';
include_once($config_file);
//Clases comunes de configuracion
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/application/services';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/contratacion/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/contratacion/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/contratacion/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/comun/controllers';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/comun/models';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/configuracion/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/configuracion/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/configuracion/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/comun/webservices';

$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/clientesyproveedores/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/clientesyproveedores/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/clientesyproveedores/models/bussines';
set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);

