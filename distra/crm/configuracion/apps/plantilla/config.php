<?php
//Direccion de la servidora
$dirIndex = $_SERVER['SCRIPT_FILENAME'];
//Direccion del fichero de configuracion
$configFile = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/comun/config.php';
//Inclusion del Fichero de Configuracion del ERP
include($configFile);

set_include_path($config['include_path']);
