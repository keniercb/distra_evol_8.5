<?php
/**
 * Fichero de configuracion del modulo de gestion del Portal
 *
 * @author  Equipo Aquitectura ERP-CUBA, Grupo I+D UCID
 * @version 1.0-0
 */
//Direccion de la servidora
$dirIndex = $_SERVER['SCRIPT_FILENAME'];
//Direccion del fichero de configuracion
$configFile = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/comun/config.php';
//Inclusion del Fichero de Configuracion del ERP
include_once($configFile);
//Inicializando el include path de php a partir de la variable de configuracion
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/comun/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/comun/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/comun/services';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/comun/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/comun/library/libreriapdf/elementos';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/comun/library/libreriapdf/fpdf/';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/comun/library/libreriapdf/fpdf/font';
/*metaconfig*/
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/metaconfig/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/metaconfig/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/metaconfig/models/domain/generated';
/*Nomenclador*/
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/nomenclador/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/nomenclador/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/nomenclador/models/domain/generated';
/*Estructura*/
$config['include_path']
    .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/estructura/models/bussines/reportes/plantillas';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/estructura/models/bussines/reportes';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/estructura/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/estructura/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/estructura/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/estructura/validators';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/estructura/models/domain/generated';
/*proyecto*/
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/proyecto/models/bussines/reportes';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/proyecto/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/proyecto/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/proyecto/models/domain/generated';
/*Subordinacion*/
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/subordinacion/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/subordinacion/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/metadatos/subordinacion/models/domain/generated';
set_include_path($config['include_path']);


