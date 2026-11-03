<?php
	//Direccion de la carpeta de publicacion
	$dir_www = $_SERVER['DOCUMENT_ROOT'];
	
	//Direccion del fichero Doctrine.php
	$dir_doctrine = $dir_www.'/repo/VDesarrollo/comun/frameworks/Doctrine/Doctrine.php';
	
	//Inclusion del fichero Doctrine.php
	require_once ($dir_doctrine);
	
	//Inicailizar autocarga de clases y ficheros de Doctrine
	spl_autoload_register(array('Doctrine', 'autoload'));
	try
	{
		//Realizo la conexion a la BD
		$conn = Doctrine_Manager::connection('pgsql://arquitectura:arquitectura@10.12.179.3/erp');	
	
		//Genero los modelos en la carpeta modsec
		Doctrine::generateModelsFromDb('models/domain');
		
		echo "Modelos generados con exito!!!";
	}
	catch (Doctrine_Exception $e)
	{
		echo $e;
	}
