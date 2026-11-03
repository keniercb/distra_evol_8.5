<?php 
/**
 * Fichero de configuracion del modulo de gestion del Portal
 * @author Equipo Aquitectura ERP-CUBA, Grupo I+D UCID
 * @version 1.0-0
 */
	//Direccion de la carpeta de publicacion
	$dir_www = $_SERVER['DOCUMENT_ROOT'];
	
	//Direccion del fichero de configuracion
	$dir_config = $dir_www.'/repo/VDesarrollo/aplicaciones/erp/configuracion/config.php';
	
	//Inclusion del Fichero de Configuracion del Marco de Trabajo
	include($dir_config);
	
	//Inicializando el include path de php a partir de la variable de configuracion
	set_include_path($config['include_path']);
	
	//Personalizacion de la variable $config con las configuraciones especificas del modulo
	/*VAN AQUI LAS CONFIGURACIONES ESPECIFICAS DEL MODULO*/
?>