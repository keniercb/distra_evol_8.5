<?php

/**
 * Fichero de configuracion del modulo CRM.
 * 
 * @author Ing. Rodain Terrer Molina
 * @copyright UCID-ERP Cuba
 * @version 1.0-0
 */
//Direccion de la servidora1
$dirIndex = $_SERVER['SCRIPT_FILENAME'];
//Direccion del fichero de configuracion

$configFile = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/comun/config.php';
//Inclusion del Fichero de Configuracion del ERP
include($configFile);

set_include_path($config['include_path']);

$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/application/services';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/contratacion/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/contratacion/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/contratacion/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/comun/controllers';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/comun/models';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/configuracion/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/configuracion/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/configuracion/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/comun/alfresco';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/importacion/controllers';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/importacion/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/importacion/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/importacion/models/bussines';
//$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/serviciomedico/controllers';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/serviciomedico/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/serviciomedico/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/crm/serviciomedico/models/bussines';


