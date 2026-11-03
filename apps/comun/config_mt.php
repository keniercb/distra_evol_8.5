<?php

/**
 * Fichero de configuracion del Marco de Trabajo
 *
 * @author Yoandry Morejon Borbon
 * @copyright UCID-ERP Cuba
 * @version 1.1-0
 */
if (isset($_SERVER['PWD']))
    $dir_index = $_SERVER['PWD'];
else
    $dir_index = $_SERVER['SCRIPT_FILENAME'];

$directorySeparator = '';

if (isset($_SERVER['REQUEST_URI'])) {
    $directorySeparator = '/';
    $reference = $directorySeparator . 'web' . $directorySeparator;
} else {
    $directorySeparator = DIRECTORY_SEPARATOR;
    $reference = 'lib';
}

//Direccion de la carpeta de publicacion
$dir_www = substr($dir_index, 0, strrpos($dir_index, $reference)) . $directorySeparator . 'web';

//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dir_rel_mt = $directorySeparator;

//Direccion absoluta del marco de trabajo
$dir_abs_mt = str_replace(
    $directorySeparator . $directorySeparator, $directorySeparator,
    dirname($dir_www . '..') . $directorySeparator . $dir_rel_mt
);

define('DIR_ABS_MT', $dir_abs_mt);

//Variable que contiene la configuracion general del Marco de Trabajo.
$config = array();

if (!function_exists('myErrorHandler')) {

    function myErrorHandler($errno, $errstr, $errfile, $errline)
    {
        $tipoerror = '';
        switch ($errno) {
            case 1:
                $tipoerror = 'E_ERROR';
                break;
            case 2:
                $tipoerror = 'E_WARNING';
                break;
            case 4:
                $tipoerror = 'E_PARSE';
                break;
            case 8:
                $tipoerror = 'E_NOTICE';
                break;
            case 16:
                $tipoerror = 'E_CORE_ERROR';
                break;
            case 32:
                $tipoerror = 'E_CORE_WARNING';
                break;
            case 64:
                $tipoerror = 'E_COMPILE_ERROR';
                break;
            case 128:
                $tipoerror = 'E_COMPILE_WARNING';
                break;
            case 256:
                $tipoerror = 'E_USER_ERROR';
                break;
            case 512:
                $tipoerror = 'E_USER_WARNING';
                break;
            case 1024:
                $tipoerror = 'E_USER_NOTICE';
                break;
            case 2047:
                $tipoerror = 'E_ALL';
                break;
            case 2048:
                $tipoerror = 'E_STRICT';
                break;
            default:
                $tipoerror = 'sin definir';
                break;
        }

        $pStr = 'Tipo Error: ' . $tipoerror . ' ,Descripcion: ' . $errstr . ' ,Archivo ' . $errfile . ' ,Linea:'
            . $errline . "\n";
        if (!file_exists(DIR_ABS_MT . '/log/php_error'))
            mkdir(DIR_ABS_MT . '/log/php_error');
/*        $fp = fopen(DIR_ABS_MT . '/log/php_error/' . $tipoerror . '.log', 'a');
        fwrite(
            $fp,
            $pStr
        );
        fclose($fp);*/
    }
}

$old_error_handler = set_error_handler("myErrorHandler");

//Direccion del modulo en ejecucion.
if (isset($_SERVER['argv']) && is_array($_SERVER['argv']) && count($_SERVER['argv']) >= 3) {
    $dir_modulo
        = substr($dir_index, 0, strrpos($dir_index, $reference)) . 'apps' . $directorySeparator . $_SERVER['argv'][3]
        . $directorySeparator;
} else {
    $dir_modulo = substr($dir_index, 0, strrpos($dir_index, $directorySeparator) + 1);
    $dir_modulo = str_replace($reference, $directorySeparator . 'apps' . $directorySeparator, $dir_modulo);
}
$config['modulo_path'] = $dir_modulo;

//Nombre del Modulo
$arr_module_name = explode($directorySeparator, $dir_modulo);
$config['module_name'] = $arr_module_name[count($arr_module_name) - 2];

//Pais en el que se va a instalar el software
//$config['idpais'] = 108; //Venezuela
$config['idpais'] = 1; //Cuba
//Include_Path de PHP con la direccion de los frameworks y los modelos de los modulos.
$config['include_path'] = '.' . PATH_SEPARATOR . $dir_abs_mt . 'lib' . $directorySeparator
    . PATH_SEPARATOR . $dir_abs_mt . 'lib' . $directorySeparator . 'Zend'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib' . $directorySeparator . 'Doctrine'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib' . $directorySeparator . 'Doctrine'. $directorySeparator . 'Doctrine'. $directorySeparator.'Parser'. $directorySeparator.'sfYaml'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib/ActiveRecord'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib/ActiveRecord/database'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib/ActiveRecord/database/drivers/postgre'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib/Gis'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib' . $directorySeparator . 'Amqp'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib' . $directorySeparator . 'Amqp' . $directorySeparator . 'Rabbit'
    . PATH_SEPARATOR . $dir_modulo . 'models' . $directorySeparator . 'bussines'
    . PATH_SEPARATOR . $dir_modulo . 'models' . $directorySeparator . 'domain'
    . PATH_SEPARATOR . $dir_modulo . 'models' . $directorySeparator . 'domain' . $directorySeparator . 'generated'
    . PATH_SEPARATOR . $dir_modulo . 'validators'
    . PATH_SEPARATOR . $dir_modulo . 'services'
    . PATH_SEPARATOR . $dir_modulo . 'controllers'
    . PATH_SEPARATOR . $dir_modulo . 'workers'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib' . $directorySeparator . 'ZendExt' . $directorySeparator . 'Trace'
    . $directorySeparator . 'bussines'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib' . $directorySeparator . 'ZendExt' . $directorySeparator . 'Trace'
    . $directorySeparator . 'domain'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib' . $directorySeparator . 'ZendExt' . $directorySeparator . 'Trace'
    . $directorySeparator . 'domain' . $directorySeparator . 'generated'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib' . $directorySeparator . 'ZendExt' . $directorySeparator . 'Trace'
    . $directorySeparator . 'workers'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib/ZendExt/Metadata/domain'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib/ZendExt/Metadata/domain/generated'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib/Alfresco/Alfresco/Service'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib/Alfresco/Alfresco/Service/WebService'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib/Alfresco/Alfresco/Service/REST'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib/Alfresco/Alfresco/Service/REST/HTTP/'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib/Alfresco/Alfresco/Service/REST/HTTP/PEAR_PACK/'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib/Alfresco/Alfresco/Service/Config/'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib/WorkflowExt'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib/WorkflowExt/Services'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib/Alfresco/Alfresco/Service/Zoho'
    . PATH_SEPARATOR . $dir_abs_mt . 'lib/VersionControl';

//Configuracion de los xml
$config ['xml']['expresiones']
    = $dir_abs_mt . 'config' . $directorySeparator . 'xml' . $directorySeparator . 'expressions.xml';
$config ['xml']['tipos_excepciones']
    = $dir_abs_mt . 'config' . $directorySeparator . 'xml' . $directorySeparator . 'tipos_excepciones.xml';
$config ['xml']['aspect'] = $dir_abs_mt . 'config' . $directorySeparator . 'xml' . $directorySeparator . 'aspect.xml';
$config ['xml']['aspecttemplate']
    = $dir_abs_mt . 'config' . $directorySeparator . 'xml' . $directorySeparator . 'aspecttemplate.xml';
$config ['xml']['aspecttemplatemt']
    = $dir_abs_mt . 'config' . $directorySeparator . 'xml' . $directorySeparator . 'aspecttemplatemt.xml';
$config ['xml']['log'] = $dir_abs_mt . 'config' . $directorySeparator . 'xml' . $directorySeparator . 'log.xml';
$config ['xml']['traza']
    = $dir_abs_mt . 'config' . $directorySeparator . 'xml' . $directorySeparator . 'CategoriaTipo.xml';
$config ['xml']['events'] = $dir_abs_mt . 'config' . $directorySeparator . 'xml' . $directorySeparator . 'events.xml';
$config ['xml']['concepts']
    = $dir_abs_mt . 'config' . $directorySeparator . 'xml' . $directorySeparator . 'concepts.xml';
$config ['xml']['traceconfig']
    = $dir_abs_mt . 'config' . $directorySeparator . 'xml' . $directorySeparator . 'traceconfig.xml';
$config ['xml']['saml']
    = $dir_abs_mt . 'config' . $directorySeparator . 'xml' . $directorySeparator . 'saml' . $directorySeparator
    . 'saml.xml';
$config ['yml']['saml']
    = $dir_abs_mt . 'config' . $directorySeparator . 'yml' . $directorySeparator . 'saml' . $directorySeparator
    . 'metadataconfig.yml';
$config ['xml']['mykeys']
    = $dir_abs_mt . 'config' . $directorySeparator . 'xml' . $directorySeparator . 'saml' . $directorySeparator
    . 'mykeys.xml';
$config ['xml']['appkeys']
    = $dir_abs_mt . 'config' . $directorySeparator . 'xml' . $directorySeparator . 'saml' . $directorySeparator
    . 'appkeys.xml';
$config ['xml']['authreq']
    = $dir_abs_mt . 'config' . $directorySeparator . 'xml' . $directorySeparator . 'saml' . $directorySeparator
    . 'templates' . $directorySeparator . 'authreq.xml';
$config ['xml']['response']
    = $dir_abs_mt . 'config' . $directorySeparator . 'xml' . $directorySeparator . 'saml' . $directorySeparator
    . 'templates' . $directorySeparator . 'response.xml';
$config ['xml']['amqpconfig']
    = $dir_abs_mt . 'lib' . $directorySeparator . 'Amqp' . $directorySeparator . 'comun' . $directorySeparator
    . 'AMQPconfig.xml';
$config ['xml']['task']
    = $dir_abs_mt . 'lib' . $directorySeparator . 'Amqp' . $directorySeparator . 'comun' . $directorySeparator
    . 'Task.xml';
$config ['workflow_path'] = $dir_abs_mt . 'lib/WorkflowExt/';
//Fichero log de excepciones
$config ['exception_log_file'] = $dir_abs_mt . 'log' . $directorySeparator . 'exception.log';
$config ['session_save_path'] = $dir_abs_mt . 'session' . $directorySeparator;

//Configuracion de ZendExt Cache
$config['cache']['frontend'] = 'Core'; //Cachear instancias de clases
$config['cache']['backend'] = 'File'; //Cachear en ficheros
$config['cache']['lifetime'] = 7200; //Tiempo de Vida
$config['cache']['automatic_serialization'] = true; //Serializar
$config['cache']['cache_dir'] = $dir_abs_mt . 'cache/'; //Directorio de cache
$config['cache']['chmod'] = 0644;

//Directorio de cache
//Comprobación de lectura escritura del usuario apache
if (!function_exists('checkDirectories')) {

    function checkDirectories($dir, & $is_writable)
    {
        if (!is_writable($dir)) {
            $is_writable = false;
            echo '<pre><b>Fatal error</b>: Apache no tiene permisos para escribir en la carpeta ' . $dir;
        }
    }

}

$is_writable = true;
checkDirectories($dir_abs_mt . 'log' . $directorySeparator, $is_writable);
checkDirectories($dir_abs_mt . 'session' . $directorySeparator, $is_writable);
checkDirectories($dir_abs_mt . 'cache' . $directorySeparator, $is_writable);
if (!$is_writable) {
    exit();
}

//Nombre de la carpeta que contiene los Controladores dentro de los modulos.
$config['controllers_path'] = $dir_modulo . 'controllers';

//Direccion del Framework de Presentacion EXTJS relativa a la carpeta de publicacion.
$config['extjs_path'] = $dir_rel_mt . 'lib' . $directorySeparator . 'ExtJS' . $directorySeparator;
$config['adapters_path'] = $dir_rel_mt . 'lib' . $directorySeparator . 'adapters' . $directorySeparator;
$config['extjs_themes_path']
    = $dir_rel_mt . 'lib' . $directorySeparator . 'ExtJS' . $directorySeparator . 'temas' . $directorySeparator;
$config['idioma']['es']['extjs_path']
    = $dir_rel_mt . 'lib' . $directorySeparator . 'ExtJS' . $directorySeparator . 'idioma' . $directorySeparator . 'es'
    . $directorySeparator;
$config['idioma']['en']['extjs_path']
    = $dir_rel_mt . 'lib' . $directorySeparator . 'ExtJS' . $directorySeparator . 'idioma' . $directorySeparator . 'en'
    . $directorySeparator;

//Direccion del Framework UCID relativa a la carpeta de publicacion.
$config['ucid_path'] = $dir_rel_mt . 'lib' . $directorySeparator . 'UCID' . $directorySeparator;

//Direccion del servidor grafico
$config['sgrafico_path']
    = $dir_rel_mt . 'lib' . $directorySeparator . 'ServidorGrafico' . $directorySeparator . 'SGAPIJS'
    . $directorySeparator;

//Require lib email
require_once $dir_abs_mt . 'lib/Adapters/PHPMailer/5.2.15/PHPMailerAutoload.php';
require_once $dir_abs_mt . '/lib/Adapters/JAXL-3.x/jaxl.php';
