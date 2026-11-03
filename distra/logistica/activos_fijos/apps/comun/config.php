<?php

/**
 * Fichero de configuración del módulo de Activos Fijos
 */
//  Direccion de la servidora
$dirIndex = $_SERVER['SCRIPT_FILENAME'];

//  Dirección del fichero de configuración
$configFile = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/logistica/utiles/comun/config.php';


//  Inclusión del Fichero de Configuración del marco de trabajo
include($configFile);
$dirabsmt = $dir_abs_mt;

$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/configuracion/unidadmedida/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/configuracion/unidadmedida/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/comprobante/models/bussines';

//  Activos Fijo
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/comun/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/depreciacion/models';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/depreciacion/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/depreciacion/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/depreciacion/services';

$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/revaluacion/models';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/revaluacion/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/revaluacion/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/revaluacion/services';

$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/configuracion/services';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/configuracion/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/configuracion/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/configuracion/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/configuracion/controllers';

$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/patrimonio/configuracion/services';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/patrimonio/configuracion/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/patrimonio/configuracion/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/patrimonio/configuracion/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/patrimonio/configuracion/controllers';

$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/utiles/services';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/utiles/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/utiles/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/utiles/models/bussines';

$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/movimiento/services';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/movimiento/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/movimiento/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/movimiento/models/bussines';

$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/documento/services';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/documento/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/documento/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/documento/models/bussines';

$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/modulo/services';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/modulo/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/modulo/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/modulo/models/bussines';

$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/regoperativo/services';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/regoperativo/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/regoperativo/models/domain/generated';

$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/regoperativo/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/comprobante/models/bussines';

//  Plugins
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/plugins/comun/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/plugins/transporte/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/activos_fijos/plugins/transporte/models/domain/generated';

//  Contabilidad
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt
    . 'apps/configuracion/modeloscontabilizacion/gestoperaciones/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt
    . 'apps/configuracion/modeloscontabilizacion/gestoperaciones/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt
    . 'apps/configuracion/modeloscontabilizacion/gestoperaciones/models/bussines';

// configuración general
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/configuracion/nomgenerales/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/configuracion/nomgenerales/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/configuracion/nomgenerales/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/configuracion/nomgenerales/services';

$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/configuracion/operaciones/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/configuracion/operaciones/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/configuracion/operaciones/models/bussines';

$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/configuracion/nomdinamicos/models/bussines';

// útiles de logística
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/planconteo/services';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/planconteo/models';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/planconteo/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/planconteo/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/planconteo/models/domain/generated';

$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/comun/models/domain';

$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/documento/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/documento/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/documento/models/domain/generated';


$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/producto/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/producto/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/producto/models/domain/generated';

$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/maestroproductos/services';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/maestroproductos/validators';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/maestroproductos/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/maestroproductos/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/maestroproductos/services';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt
    . 'apps/logistica/utiles/maestroproductos/models/domain/generated';


$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/inventario/salida/salida/services';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/inventario/salida/salida/models';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/inventario/salida/salida/models/bussines';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/inventario/salida/salida/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt
    . 'apps/logistica/inventario/salida/salida/models/domain/generated';


$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/ubicacion/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/ubicacion/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/ubicacion/models/bussines';

$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/nomencladores/models/domain';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/nomencladores/models/domain/generated';
$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/nomencladores/models/bussines';

$config['include_path'] .= PATH_SEPARATOR . $dirabsmt . 'apps/logistica/utiles/ubicacion/services';
