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
$configFile = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/metadatos/comun/config.php';
//Inclusion del Fichero de Configuracion del ERP
include($configFile);
//Inicializando el include path de php a partir de la variable de configuracion
set_include_path($config['include_path']);

