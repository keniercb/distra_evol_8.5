<?php
/**
 * Fichero de configuracion del modulo de gestion del Portal
 * @author Equipo Aquitectura ERP-CUBA, Grupo I+D UCID
 * @version 1.0-0
 */

	//Direccion de la servidora
	$dir_index = $_SERVER['SCRIPT_FILENAME'];   
	//Direccion del fichero de configuracion
	$config_file = substr($dir_index, 0, strrpos($dir_index, 'web')) . 'apps/comun/config.php';
	//Inclusion del Fichero de Configuracion del ERP
	include($config_file);
	//Inicializando el include path de php a partir de la variable de configuracion
/*
    $config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/comun/models/bussines';
    
    $config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/inventario/movimientos/models/domain';
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/inventario/movimientos/models/bussines';
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/inventario/movimientos/models/domain/generated';	

	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/estructura/documentos/models/domain';
    $config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/estructura/documentos/models/bussines';
    $config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/estructura/documentos/models/domain/generated';
	
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/estructura/productos/models/domain';
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/estructura/productos/models/bussines';
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/estructura/productos/models/domain/generated';
    
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/inventario/configuracion/models/domain';
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/inventario/configuracion/models/bussines';	
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/inventario/configuracion/models/domain/generated';	

	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/facturacion/configuracion/models/domain';
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/facturacion/configuracion/models/bussines';
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/facturacion/configuracion/models/domain/generated';

    $config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/facturacion/facturacion/models/domain';
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/facturacion/facturacion/models/bussines';
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/facturacion/facturacion/models/domain/generated';
		
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/inventario/combustible/models/domain';
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/inventario/combustible/models/bussines';
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/inventario/combustible/models/domain/generated';
	
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/activos_fijos/AFT/models/domain';
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/activos_fijos/AFT/models/bussines';
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/activos_fijos/AFT/models/domain/generated';
	
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/inventario/nomencladores/models/domain';
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/inventario/nomencladores/models/bussines';
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/inventario/nomencladores/models/domain/generated';
	
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/activos_fijos/movimiento/models/domain';
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/activos_fijos/movimiento/models/bussines';
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/activos_fijos/movimiento/models/domain/generated';

	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/activos_fijos/documentos/models/domain';
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/activos_fijos/documentos/models/bussines';
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/activos_fijos/documentos/models/domain/generated';
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/activos_fijos/comun/models';
	
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/activos_fijos/modificaciones/models/domain';
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/activos_fijos/modificaciones/models/bussines';
	$config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/activos_fijos/modificaciones/models/domain/generated';

	
    $config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/models/domain';
    $config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/models/bussines';
    $config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/utiles/models/domain/generated';
*/