<?php
/**
 * Fichero de configuracion del modulo de gestion del Portal
 *
 * @author  Equipo Aquitectura ERP-CUBA, Grupo I+D UCID
 * @version 1.0-0
 */
//Direccion de la servidora

if (isset($_SERVER['PWD'])) {
    $dir_index = $_SERVER['PWD'];
} else {
    $dir_index = $_SERVER['SCRIPT_FILENAME'];
}

$directorySeparator = '';

if (isset($_SERVER['REQUEST_URI'])) {
    $directorySeparator = '/';
    $reference = $directorySeparator . 'web' . $directorySeparator;
} else {
    $directorySeparator = DIRECTORY_SEPARATOR;
    $reference = 'lib';
}
//Direccion del dirctorio donde estan las aplicaciones
$dir_root = substr($dir_index, 0, strrpos($dir_index, $reference)) . $directorySeparator;
$dir_aplication = $dir_root . 'apps' . $directorySeparator;
$dir_webaplication = $dir_root . 'web' . $directorySeparator;

//Direccion del fichero de configuracion
//$dir_config = substr($dir_index, 0, strrpos($dir_index, $reference)) . $directorySeparator . 'apps' .
// $directorySeparator . 'config.php';
$dir_config = dirname(__FILE__) . $directorySeparator . 'config_mt.php';

//Inclusion del Fichero de Configuracion del Marco de Trabajo
include($dir_config);
$requestUri = (isset($_SERVER['REQUEST_URI'])) ? $_SERVER['REQUEST_URI'] : ' ';
$config ['uri_aplication'] = substr($requestUri, 0, strrpos($requestUri, 'web')) . 'web';
$config ['dir_aplication'] = $dir_aplication;
$config ['dir_webaplication'] = $dir_webaplication;

//Configuracion de los xml
$dirSistema = $dir_aplication;
$uriXmlConfig = 'comun' . $directorySeparator . 'recursos' . $directorySeparator . 'xml' . $directorySeparator;
$config ['uri_xml_config'] = $uriXmlConfig;
$config ['directory_separator'] = $directorySeparator;
$dirConfigModules = $dirSistema . $uriXmlConfig;

$config ['xml']['excepciones'] = $dirConfigModules . 'exception.xml';
$config ['xml']['ioc'] = $dirConfigModules . 'ioc.xml';
$config ['xml']['modulesconfig'] = $dirConfigModules . 'modulesconfig.xml';
$config ['xml']['rules'] = $dirConfigModules . 'rules.xml';
$config ['xml']['comprobantetipo']
    = $dirSistema . 'configuracion' . $directorySeparator . 'comprobantetipo' . $directorySeparator . 'contrato'
    . $directorySeparator . 'comun' . $directorySeparator . 'recursos' . $directorySeparator . 'xml'
    . $directorySeparator . 'comprobantetipo.xml';
$config ['xml']['documentos']
    =
    $dirSistema . 'configuracion' . $directorySeparator . 'comprobantetipo' . $directorySeparator . 'gestioncomprobante'
    . $directorySeparator . 'comun' . $directorySeparator . 'recursos' . $directorySeparator . 'xml'
    . $directorySeparator . 'documentos.xml';
$config ['xml']['categoriadoc']
    =
    $dirSistema . 'configuracion' . $directorySeparator . 'comprobantetipo' . $directorySeparator . 'gestioncomprobante'
    . $directorySeparator . 'comun' . $directorySeparator . 'recursos' . $directorySeparator . 'xml'
    . $directorySeparator . 'categoriadoc.xml';
$config ['xml']['nomconfig'] = $dirConfigModules . 'nomconfig.xml';
$config ['xml']['subsistemas'] = $dirConfigModules . 'subsistemas.xml';
$config ['xml']['notification'] = $dirConfigModules . 'notification.xml';
$config ['xml']['notificationevents'] = $dirConfigModules . 'notificationevents.xml';
$config ['xml']['Ayuda'] = $dirConfigModules . 'Ayuda.xml';
$config ['xml']['ACL'] = $dirConfigModules . 'publicACL.xml';
$config ['xml']['servers'] = $dirConfigModules . 'servers.xml';
$config ['xml']['noAuthenticateACL'] = $dirConfigModules . 'noAuthenticateACL.xml';
$config ['xml']['ConfiguracioRepoAlfresco'] = $dir_abs_mt . 'lib/Alfresco/Alfresco/Service/Config/configuracion.xml';

if (isset($_SERVER['argv']) && is_array($_SERVER['argv']) && count($_SERVER['argv']) >= 3) {
    $module_reference = $_SERVER['argv'][3];
} else {
    $array_module = explode('.php', $dir_index);
    $array_module = explode('/web/', $array_module[0]);
    $array_module = explode($directorySeparator, isset($array_module[1]) ? $array_module[1] : $array_module[0]);
    unset($array_module[count($array_module) - 1]);
    $module_reference = implode($directorySeparator, $array_module);
}

$config ['module_reference'] = $module_reference;
$module = isset($array_module[0]) ? $array_module[0] : "";
$dirXmlConfigModule = $dirSistema . $module . $directorySeparator . 'comun' . $directorySeparator . 'recursos'
    . $directorySeparator . 'xml' . $directorySeparator;
$config ['xml']['iocinter'] = $dirXmlConfigModule . 'ioc.xml';
$config ['xml']['validation'] = $dirXmlConfigModule . 'validation.xml';
$config ['xml']['managerexception'] = $dirXmlConfigModule . 'managerexception.xml';
$config ['xml']['weaver'] = $dirXmlConfigModule . 'weaver.xml';
$config ['xml']['module']['modulesconfig'] = $dirXmlConfigModule . 'modulesconfig.xml';

$config['certsDirectory'] = $dir_root . 'config' . $directorySeparator . 'certs' . $directorySeparator ;

$config['expimp'] = $dir_aplication . $directorySeparator . 'comun';
$config['enable_security'] = true;
$config['development'] = false;
$config['msgTypeException'] = false;
$config['extdirect_config'] = $dir_aplication . 'comun' . $directorySeparator . '' . 'extdirect.ini';
$config['security_config'] = $dir_aplication . 'comun' . $directorySeparator . 'security.ini';

//Configuraciones del servidor en tiempo de ejecucion

ini_set('upload_max_filesize', '1024M');
ini_set('post_max_size', '1024M');
ini_set('date.timezone', 'America/Havana');
ini_set('max_execution_time', '6000');
ini_set('memory_limit', '1024M');
ini_set('file_uploads', 'On');

include_once(__DIR__."/../../lib/xmlseclibs/xmlseclibs.php");
include_once(__DIR__."/../../lib/psr/log/_autoload.php");
include_once(__DIR__."/../../lib/saml2/src/_autoload.php");
