<?php

/**
 * Fichero de configuracion del modulo de gestion del Portal
 * @author Equipo Aquitectura ERP-CUBA, Grupo I+D UCID
 * @version 1.0-0
 */
//Direccion de la servidora
if (isset($_SERVER['PWD']))
    $dirIndex = $_SERVER['PWD'];
else
    $dirIndex = $_SERVER['SCRIPT_FILENAME'];

$directorySeparator = '';

if (isset($_SERVER['REQUEST_URI'])) {
    $directorySeparator = '/';
    $reference = $directorySeparator . 'web' . $directorySeparator;
} else {
    $directorySeparator = DIRECTORY_SEPARATOR;
    $reference = 'lib';
}
//Direccion del dirctorio donde estan las aplicaciones
$dirSeguridad = substr($dirIndex, 0, strrpos($dirIndex, $reference)) . 
        $directorySeparator . 'apps' . $directorySeparator . 
        'seguridad' . $directorySeparator;

//Direccion del fichero de configuracion
$dirConfig = substr($dirIndex, 0, strrpos($dirIndex, $reference)) . 
        $directorySeparator . 'apps' . $directorySeparator . 'comun' . 
        $directorySeparator . 'config.php';

//Inclusion del Fichero de Configuracion del Marco de Trabajo
include($dirConfig);
$dirXML = $dirSeguridad . 'comun' . $directorySeparator . 'recursos' . 
        $directorySeparator . 'xml' . $directorySeparator;
$dirINI = $dirSeguridad . 'comun' . $directorySeparator . 'recursos' . 
        $directorySeparator . 'ini' . $directorySeparator;
//Configuracion de los xml
$config ['xml']['certificado'] = $dirXML . 'Certificado_template.xml';
$config ['xml']['recursos'] = $dirXML . 'recursos.xml';
$config ['ini']['configArbol'] = $dirINI . 'config.ini';