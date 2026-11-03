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
$config_file = substr($dir_index, 0, strrpos($dir_index, 'web')) . 'apps/logistica/utiles/comun/config.php';
//Inclusion del Fichero de Configuracion del ERP
include($config_file);
//planeacion
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/planificacion/producciones/controllers';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/planificacion/producciones/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/planificacion/producciones/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/planificacion/producciones/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/planificacion/producciones/validators';

$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/planificacion/planmeta/controllers';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/planificacion/planmeta/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/planificacion/planmeta/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/planificacion/planmeta/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/planificacion/planmeta/validators';

$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/produccion/documento/controllers';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/produccion/documento/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/produccion/documento/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/produccion/documento/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/produccion/documento/validators';

$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/contabilidad/contabilidad_costos/configuracion/controllers';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/contabilidad/contabilidad_costos/configuracion/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/contabilidad/contabilidad_costos/configuracion/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/contabilidad/contabilidad_costos/configuracion/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/contabilidad/contabilidad_costos/configuracion/validators';



set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);