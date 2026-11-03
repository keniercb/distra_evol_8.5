<?php
	//Direccion de la carpeta de publicacion
	$dir_www = $_SERVER['DOCUMENT_ROOT'];
	
	//Direccion del fichero Doctrine.php ...
	$dir_doctrine = $dir_www.'/repo/VDesarrollo/comun/frameworks/Doctrine';

	//Direccion del modulo en ejecucion.
	$dir_index = $_SERVER['SCRIPT_FILENAME'];
	$ult_pos = strrpos($dir_index, '/') + 1;
	$dir_modulo = substr($dir_index, 0, $ult_pos);
	$config['modulo_path'] = $dir_modulo;
	
	//Direccion de los modelos dentro del modulo en ejecucion.
	$dir_modelos = $dir_modulo.'models/';
	
	//Inicializar el include_path
	$include_path = '.'
				. PATH_SEPARATOR . $dir_doctrine
				. PATH_SEPARATOR . $dir_modelos . 'domain'
				. PATH_SEPARATOR . $dir_modelos . 'domain/generated';
	if (DIRECTORY_SEPARATOR == '\\')
		$include_path = str_replace('/','\\',$include_path);
	set_include_path($include_path);
	//echo get_include_path(); die();
	
	//Inclusion del fichero Doctrine.php
	$fich_doctrine = 'Doctrine.php';
	require_once ($fich_doctrine);

	//Inicailizar autocarga de clases y ficheros de Doctrine
	spl_autoload_register(array('Doctrine', 'autoload'));
	
	try
	{
		//Realizo la conexion a la BD
		Doctrine_Manager::connection('pgsql://erp:erp2008@10.12.171.4/erp');
		echo "Los modelos fueron generados correctamente!!!";
		//Genero los modelos en la carpeta modsec
		Doctrine::generateModelsFromDb('models/domain');
		
		//Generando el sql a partir de los modelos
		//$sql = Doctrine::generateSqlFromModels('models/domain');
		//echo $sql;
	}
	catch (Doctrine_Exception $e)
	{
		echo $e;
	}
	
?>