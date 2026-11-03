<?php
//Direccion de Zeolides
$dir_zeolides = substr(__FILE__, 0, strrpos(__FILE__, 'apps/'));

//Direccion de Zeolides relativa a la carpeta de publicacion.
$dir_rel_zeolides = '/';

//Configuracion de los xml del framework de Zeolides
$config ['xml']['expresiones'] = $dir_zeolides . 'config/xml/expressions.xml';
$config ['xml']['tipos_excepciones'] = $dir_zeolides . 'config/xml/tipos_excepciones.xml';
$config ['xml']['aspect'] = $dir_zeolides . 'config/xml/aspect.xml';
$config ['xml']['aspecttemplate'] = $dir_zeolides . 'config/xml/aspecttemplate.xml';
$config ['xml']['aspecttemplatemt'] = $dir_zeolides . 'config/xml/aspecttemplatemt.xml';
$config ['xml']['log'] = $dir_zeolides . 'config/xml/log.xml';
$config ['xml']['traza'] = $dir_zeolides . 'config/xml/CategoriaTipo.xml';
$config ['xml']['events'] = $dir_zeolides . 'config/xml/events.xml';
$config ['xml']['concepts'] = $dir_zeolides . 'config/xml/concepts.xml';
$config ['xml']['traceconfig'] = $dir_zeolides . 'config/xml/traceconfig.xml';
$config ['xml']['saml'] = $dir_zeolides . 'config/xml/saml/saml.xml';
$config ['xml']['amqpconfig'] = $dir_zeolides . 'lib/Amqp/comun/AMQPconfig.xml';
$config ['xml']['task'] = $dir_zeolides . 'lib/Amqp/comun/Task.xml';

//Configuracion de los xml de Zeolides
$dir_xml_zeolides = $dir_zeolides . 'apps/comun/recursos/xml/';
$config ['xml']['excepciones'] = $dir_xml_zeolides . 'exception.xml';
$config ['xml']['validation'] = $dir_xml_zeolides . 'validation.xml';
$config ['xml']['managerexception'] = $dir_xml_zeolides . 'managerexception.xml';
$config ['xml']['weaver'] = $dir_xml_zeolides . 'weaver.xml';
$config ['xml']['ioc'] = $dir_xml_zeolides . 'ioc.xml';
$config ['xml']['modulesconfig'] = $dir_xml_zeolides . 'modulesconfig.xml';
$config ['xml']['nomconfig'] = $dir_xml_zeolides . 'nomconfig.xml';
$config ['xml']['subsistemas'] = $dir_xml_zeolides . 'subsistemas.xml';
$config ['xml']['notification'] = $dir_xml_zeolides . 'notification.xml';
$config ['xml']['notificationevents'] = $dir_xml_zeolides . 'notificationevents.xml';
$config ['xml']['ACL'] = $dir_xml_zeolides . 'publicACL.xml';

//Fichero log de excepciones
$config ['exception_log_file'] = $dir_zeolides . 'log/exception.log';
$config ['session_save_path'] = $dir_zeolides . 'session/';

//Configuracion de ZendExt Cache
$config['cache']['frontend'] = 'Core'; //Cachear instancias de clases
$config['cache']['backend'] = 'File'; //Cachear en ficheros
$config['cache']['lifetime'] = 7200; //Tiempo de Vida
$config['cache']['automatic_serialization'] = true; //Serializar
$config['cache']['cache_dir'] = $dir_zeolides . 'cache/'; //Directorio de cache
$config['cache']['chmod'] = 0644; //Directorio de cache

//Direccion del Framework de Presentacion EXTJS relativa a la carpeta de publicacion.
$config['extjs_path'] = $dir_rel_zeolides . 'lib/ExtJS/';
$config['idioma']['es']['extjs_path'] = $dir_rel_zeolides . 'lib/ExtJS/idioma/es/';

//Direccion del Framework UCID relativa a la carpeta de publicacion.
$config['ucid_path'] = $dir_rel_zeolides . 'lib/UCID/';

//Direccion de las aplicaciones de Zeolides relativa a la carpeta de publicacion
$config ['uri_aplication'] = '/';

//Direccion absoluta de las aplicaciones de Zeolides
$config ['dir_aplication'] = $dir_zeolides . 'apps/';

//Direccion absoluta del fichero de configuración de seguridad de Zeolides.
$config['security_config'] = $dir_zeolides.'apps/comun/security.ini';

//Direccion de EXTJS relativa a la carpeta de publicacion.
$config['extjs_path'] = '/lib/ExtJS/';
$config['extjs_themes_path'] = '/lib/ExtJS/temas/';
$config['idioma']['es']['extjs_path'] = '/lib/ExtJS/idioma/es/';
$config['idioma']['en']['extjs_path'] = '/lib//ExtJS/idioma/en/';

//Nombre y referencia del GDR.
$config['module_reference'] = 'gdr';
$config['module_name'] = 'gdr';


//echo '<pre>';print_r($config);die;
//Include_Path de PHP con la direccion de los frameworks y los modelos de los modulos.
$include_path = '.' . PATH_SEPARATOR . $dir_zeolides . 'lib/'
                    . PATH_SEPARATOR . $dir_zeolides . 'lib/Doctrine'

                    . PATH_SEPARATOR . $dir_zeolides . 'lib/ZendExt/Trace/domain'
                    . PATH_SEPARATOR . $dir_zeolides . 'lib/ZendExt/Trace/domain/generated'
                    . PATH_SEPARATOR . $dir_zeolides . 'lib/ZendExt/Trace/bussines'
                    . PATH_SEPARATOR . $dir_zeolides . 'lib/ZendExt/Trace/workers'

                    . PATH_SEPARATOR . $dir_zeolides . 'lib/Amqp'
                    . PATH_SEPARATOR . $dir_zeolides . 'lib/Amqp/Rabbit';
;
//Agregando el framework al include_path
$old_include_path = get_include_path();
set_include_path($include_path);

//Iniciando la autocarga de clases
$loader_file = 'Zend/Loader/Autoloader.php';
include_once($loader_file);
$autoloader = Zend_Loader_Autoloader::getInstance();
$autoloader->setFallbackAutoloader(true);

//Iniciando Zeolides para aplicaciones externas
$app = new ZendExt_App_External();
$app->init($config);

Zend_Session::writeClose();
$autoloader->setFallbackAutoloader(false);
spl_autoload_unregister(array($autoloader, 'autoload'));
Zend_Loader_Autoloader::resetInstance();
set_include_path($old_include_path);
ini_set('session.save_handler', 'files');
