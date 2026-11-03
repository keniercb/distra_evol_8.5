<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . 'logistica/utiles/comun/config.php';
    include_once $dir;
    $config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/facturacion/facturacion/factura/plugins';
    $config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/facturacion/facturacion/configuracion/models/bussines';
    $config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/facturacion/facturacion/configuracion/models/domain';
    $config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/facturacion/facturacion/configuracion/models/domain/generated';
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class TrabajoOperariosService extends ZendExt_Model
{
    private $_model;

    public function __construct()
    {
        parent::ZendExt_Model();
        $aperturaAFT = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_AFT);
        $this->_model = new TrabajoOperariosModel(
            array('alias' => 'trabajoOperariosServicioLOG', 'subsistema' => LogisticaGlobal::SUBSISTEMA_TALLERES), $aperturaAFT
        );
    }

    public function getTrabajoOperariosIndicadores()
    {
        return $this->_model->getTrabajoOperariosIndicadores();
    }

    public function getTrabajoOperariosDenomByIdIndicador($idIndicador)
    {
        return $this->_model->getTrabajoOperariosDenomByIdIndicador($idIndicador);
    }

    public function getTrabajoOperariosSalarios($idestructura, $fechainicio, $fechafin)
    {
        return $this->_model->getTrabajoOperariosSalarios($idestructura, $fechainicio, $fechafin);
    }

//    public function actualizarCumplimiento($parametros) {
//        if (!class_exists('TrabajoOperariosModel')) {
//            $dirBase = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/talleres/trabajooperarios/';
//            include_once $dirBase . 'models/bussines/TrabajoOperariosModel.php';
//            include_once $dirBase . 'models/domain/generated/BaseDatTrabajoOperarios.php';
//            include_once $dirBase . 'models/domain/generated/BaseDatTrabajoOperariosDetallado.php';
//            include_once $dirBase . 'models/domain/DatTrabajoOperarios.php';
//            include_once $dirBase . 'models/domain/DatTrabajoOperariosDetallado.php';
//        }
//        return $this->_model->actualizarCumplimiento($parametros);
//    }


}
