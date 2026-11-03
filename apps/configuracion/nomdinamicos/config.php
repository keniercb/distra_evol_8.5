<?php

/**
 * Fichero de configuracion del modulo de gestion del Portal
 * @author  Equipo Aquitectura ERP-CUBA, Grupo I+D UCID
 * @version 1.0-0
 */
//Direccion de la servidora
$dir_index = $_SERVER['SCRIPT_FILENAME'];
//Direccion del fichero de configuracion
$config_file = substr($dir_index, 0, strrpos($dir_index, 'web')) . 'apps/configuracion/comun/config.php'; //testing for finding NomPais
//Inclusion del Fichero de Configuracion del ERP
include($config_file);
set_include_path($config['include_path']);

//Inicializando el include path de php a partir de la variable de configuracion
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/nomdinamicos/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/nomdinamicos/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/nomdinamicos/models/domain/generated';

