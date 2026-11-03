<?php

/**
 * @author Lisbeth Macias
 * @date   : 23/11/2012
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class DocsdepreciacionController extends BaseController
{
    private $model, $_sConfGeneral;

    public function init()
    {
        parent:: init('log.aft.docsdepreciacion');
        $this->model = new DocsdepreciacionModel();
        $this->_sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
    }

    function docsdepreciacionAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.docsdepreciacion');
        $this->renderTemplate();
    }

    public function cargarDocumentosAction()
    {
        $datos = $this->model->cargarDocumentosDepreciacion($this->uiParams);
        $this->datos = $datos['datos'];
        $this->cantidad = $datos['cantidad'];
    }

    public function cargarSustitutosAction()
    {
        $datos = $this->model->cargarSustitutos($this->uiParams);
        $this->datos = $datos['datos'];
        $this->cantidad = $datos['cantidad'];
    }
    public function imprimirExcelAction()
    {
        $this->dirFichero = $this->model->crearexcelactivosdepre($this->uiParams);
    }


    public function revertirdepreciacionAction()
    {        
        $iddocumento = $this->uiParams['iddocumento'];
        $cEstructura = 'Estructura';
        $idestructura = $this->global->$cEstructura->idestructura;
        $idPeriodoActual = $this->_sConfGeneral->getPeriodoActualSubsistema($idestructura, 11, null);
        $resp = $this->model->revertirUltimaDepreciacion($iddocumento, $idPeriodoActual);
        
        $this->codigoMsg = $resp['codigoMsg'];
        $this->errorMessage = $resp['errorMessage'];
        if($resp['codigoMsg'] == 2){
            $this->titleMessage = $resp['titleMessage'];
            $this->message = $resp['message'];
        }
    }

    public function obtenerEjerciciosAction(){
        
        $cEstructura = 'Estructura';
        $idestructura = $this->global->$cEstructura->idestructura;
        $this->datos = $this->_sConfGeneral->obtenerEjercicios($idestructura);
    }
}
