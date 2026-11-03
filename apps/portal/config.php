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
$dirConfig = substr($dirIndex, 0, strrpos($dirIndex, 'aplicaciones')) . 'config.php';
//Inclusion del Fichero de Configuracion del Marco de Trabajo
include($dirConfig);
//Configuracion de los xml
$config ['xml']['modules'] = substr($dirIndex, 0, strrpos($dirIndex, 'erp')) . 'erp/comun/recursos/xml/';
