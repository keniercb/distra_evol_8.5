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

//Inclusion del Fichero de Configuracion del Marco de Trabajo
include($dirconfig);

//Inicializando el include path de php a partir de la variable de configuracion
set_include_path($config['include_path']);

// Inclusion del fichero con las funciones personalizadas
include($dir_abs_mt . 'apps/configuracion/comun/models/bussines/UtilesDatosMaestros.php');

//Personalizacion de la variable $config con las configuraciones especificas del modulo

/*VAN AQUI LAS CONFIGURACIONES ESPECIFICAS DEL MODULO*/
$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/configuracion/comun/models/bussines';
