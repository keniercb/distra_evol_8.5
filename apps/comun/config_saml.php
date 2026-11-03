<?php

//Direccion de PACKSOFT
$dir_pacsoft = substr(__FILE__, 0, strrpos(__FILE__, 'apps'));

//Direccion PACKSOFT relativa a la carpeta de publicacion.
$dir_rel_pacsoft = '/';

$config = array();
//Configuracion de los xml del framework de PACSOFT
$config ['xml']['expresiones'] = $dir_pacsoft . 'config/xml/expressions.xml';
$config ['xml']['tipos_excepciones'] = $dir_pacsoft . 'config/xml/tipos_excepciones.xml';
$config ['xml']['aspect'] = $dir_pacsoft . 'config/xml/aspect.xml';
$config ['xml']['aspecttemplate'] = $dir_pacsoft . 'config/xml/aspecttemplate.xml';
$config ['xml']['aspecttemplatemt'] = $dir_pacsoft . 'config/xml/aspecttemplatemt.xml';
$config ['xml']['log'] = $dir_pacsoft . 'config/xml/log.xml';
$config ['xml']['traza'] = $dir_pacsoft . 'config/xml/CategoriaTipo.xml';
$config ['xml']['concepts'] = $dir_pacsoft . 'config/xml/concepts.xml';
$config ['xml']['traceconfig'] = $dir_pacsoft . 'config/xml/traceconfig.xml';

//Configuracion de los xml de PACSOFT
$dir_xml_pacsoft = $dir_pacsoft . 'apps/comun/recursos/xml/';
$config ['xml']['excepciones'] = $dir_xml_pacsoft . 'exception.xml';
$config ['xml']['validation'] = $dir_xml_pacsoft . 'validation.xml';
$config ['xml']['managerexception'] = $dir_xml_pacsoft . 'managerexception.xml';
$config ['xml']['weaver'] = $dir_xml_pacsoft . 'weaver.xml';
$config ['xml']['ioc'] = $dir_xml_pacsoft . 'ioc.xml';
$config ['xml']['modulesconfig'] = $dir_xml_pacsoft . 'modulesconfig.xml';
$config ['xml']['nomconfig'] = $dir_xml_pacsoft . 'nomconfig.xml';
$config ['xml']['rules'] = $dir_xml_pacsoft . 'rules.xml';

//Fichero log de excepciones
$config ['exception_log_file'] = $dir_pacsoft . 'log/exception.log';
$config ['session_save_path'] = $dir_pacsoft . 'session/';

//Configuracion de ZendExt Cache
$config['cache']['frontend'] = 'Core'; //Cachear instancias de clases
$config['cache']['backend'] = 'File'; //Cachear en ficheros
$config['cache']['lifetime'] = 7200; //Tiempo de Vida
$config['cache']['automatic_serialization'] = true; //Serializar
$config['cache']['cache_dir'] = $dir_pacsoft . 'cache/'; //Directorio de cache
$config['cache']['chmod'] = 0644; //Directorio de cache

//Direccion del Framework de Presentacion EXTJS relativa a la carpeta de publicacion.
$config['extjs_path'] = $dir_rel_pacsoft . 'lib/ExtJS/';
$config['idioma']['es']['extjs_path'] = $dir_rel_pacsoft . 'lib/ExtJS/idioma/es/';

//Direccion del Framework UCID relativa a la carpeta de publicacion.
$config['ucid_path'] = $dir_rel_pacsoft . 'lib/UCID/';

//Direccion absoluta de las aplicaciones de PACKSOFT
$config ['uri_aplication'] = '/';

//Direccion de las aplicaciones de PACKSOFT relativa a la carpeta de publicacion
$config ['dir_aplication'] = $dir_pacsoft . 'apps/';
$config ['module_reference'] = 'seguridad';
$config ['module_name'] = 'seguridad';

//Include_Path de PHP con la direccion de los frameworks y los modelos de los modulos.
$include_path = '.' . PATH_SEPARATOR . $dir_pacsoft . 'lib/'
    . PATH_SEPARATOR . $dir_pacsoft . 'lib/Doctrine'

    . PATH_SEPARATOR . $dir_pacsoft . 'lib/ZendExt/Trace/domain'
    . PATH_SEPARATOR . $dir_pacsoft . 'lib/ZendExt/Trace/domain/generated';

//Agregando el framework al include_path
set_include_path($include_path);

//Iniciando la autocarga de clases
$loader_file = 'Zend/Loader/Autoloader.php';
include_once($loader_file);
$autoloader = Zend_Loader_Autoloader::getInstance();
$autoloader->setFallbackAutoloader(true);

//Iniciando PACKSOFT para aplicaciones externas
$app = new ZendExt_App_Cli();
$app->init($config);
//Zend_Session::writeClose(false);
//Zend_Loader::registerAutoload('Zend_Loader', false);
