<?php
/**
 * Fichero de configuracion del modulo de gestion del Portal
 * @author  Equipo Aquitectura ERP-CUBA, Grupo I+D UCID
 * @version 1.0-0
 */
//Direccion de la servidora
$dirindex = $_SERVER['SCRIPT_FILENAME'];
//Direccion del fichero de configuracion
$configfile = substr($dirindex, 0, strrpos($dirindex, 'web')) . 'apps/comun/config.php';
//Inclusion del Fichero de Configuracion del ERP
include($configfile);
set_include_path($config['include_path']);

$dirAbsMt = $dir_abs_mt;

//Inicializando el include path de php a partir de la variable de configuracion
$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/comun/models/bussines';

$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/multimoneda/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/multimoneda/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/multimoneda/models/domain/generated';

$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/divisionpolitica/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/divisionpolitica/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/divisionpolitica/models/bussines';

$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/paisesentidad/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/paisesentidad/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/paisesentidad/models/bussines';

$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/nomgenerales/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/nomgenerales/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/nomgenerales/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/nomgenerales/services';

$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/nomdinamicos/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/nomdinamicos/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/nomdinamicos/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/nomdinamicos/services';

$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/gruposubgrupo/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/gruposubgrupo/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/gruposubgrupo/models/bussines';

$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/agrupaciones/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/agrupaciones/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/agrupaciones/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/agrupaciones/services';

$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/indicadores/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/indicadores/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/indicadores/models/bussines';

$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/firmadigital/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/firmadigital/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirAbsMt . 'apps/configuracion/firmadigital/models/bussines';




