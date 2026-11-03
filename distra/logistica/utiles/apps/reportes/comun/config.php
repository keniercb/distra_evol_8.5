<?php
/**
 * Fichero de inicio del modulo de gestion del Portal
 *
 * @author Yoandry Morejon Borbon
 * @copyright UCID-ERP Cuba
 * @version 1.0-0
 */
//Direccion de la servidora
$dir_index = $_SERVER['SCRIPT_FILENAME'];
$config_file_jasper = substr($dir_index, 0, strrpos($dir_index, 'web')) . 'lib/JasperReports/JasperClient/autoload.php';
if (!file_exists($config_file_jasper)) {
    throw new Exception('El fichero de configuracion del reporte no existe');
} elseif (!is_readable($config_file_jasper)) {
    throw new Exception('No se pudo leer el fichero de configuracion del reporte. Acceso denegado.');
} else {
    require_once $config_file_jasper;
}
