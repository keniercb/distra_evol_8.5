<?php

/**
 * @autor Equipo de Arquitectura UCID
 *
 * @package    Amqp
 * @subpackage Worker
 * @version    1.0
 */
$arrayArguments = $_SERVER['argv'];
$name_event = $arrayArguments[1];
$arrayComands = $arrayArguments[2];
//$id_user = (int)$arrayArguments[3];

/*$workerReference = $arrayArguments[3];
$arguments = json_decode(stripslashes($arrayArguments[4]));
$task_name = $arrayArguments[5];*/

//$workerReference = 'herramientas/notificaciones';
if (isset($_SERVER['PWD']))
	$dir_index = $_SERVER['PWD'];
else
	$dir_index = $_SERVER['SCRIPT_FILENAME'];
//Se carga el fichero de configuracion del componente pasado por parametro
$dir_MT = substr($dir_index, 0, strrpos($dir_index, 'lib'));
$config_file = $dir_MT . 'apps' . DIRECTORY_SEPARATOR . 'comun' . DIRECTORY_SEPARATOR . 'config.php';

if (!is_readable($config_file)) {
	throw new Exception('No se pudo leer el fichero de configuracion. Acceso denegado.');
} else {
	//Se inicializa la variable de configuración
	$config = array();

	//Se incluye el fichero de configuracion.
	include_once ($config_file);
	if (!isset($config['include_path']))
		throw new Exception('El framework no esta configurado correctamente.');

	//Se inicializa el include path de php a partir de la variable de configuracion
	set_include_path($config['include_path']);

	//Se realiza la autocarga de las clases de Zend
	$loader_file = $dir_MT . 'lib' . DIRECTORY_SEPARATOR . 'Zend' . DIRECTORY_SEPARATOR . 'Loader' . DIRECTORY_SEPARATOR . 'Autoloader.php';
	if (!@include_once($loader_file))
		throw new Exception('El framework no esta configurado correctamente.');
	$autoloader = Zend_Loader_Autoloader :: getInstance();
	$autoloader->setFallbackAutoloader(true);


	//Se inicia la configuracion de la aplicacion
	$app = new ZendExt_App_Cli();
	$app->init($config);
	//Zend_Registry :: getInstance()->idusuario = end($arguments->arguments);
	$ioc = ZendExt_IoC::getInstance();

	$notifications = ZendExt_Event_Notification::getInstance();

	$cmd = explode("/@",$arrayComands);
	//foreach ($arrayComands)
	//$cmd = array('prueba'=>'prueba', 'campo'=>'campo');
	$notifications->dispatch($name_event, $cmd);
	/*$result = $ioc->notification->sendSistemMessage(
		array('18'), 'nuevo heee', 4, $id_user
	);*/

	/*$id_persons = (count($id_persons) >= 1) ? explode('.',$id_persons) : null;
	$contens = (count($contens) > 1) ? str_replace(".", " ", $contens) : $contens;

	$result = $ioc->notification->sendSistemMessage(
		$id_persons, $contens, $tipo_aviso, $id_user
	);*/
	$app->finish();


}


