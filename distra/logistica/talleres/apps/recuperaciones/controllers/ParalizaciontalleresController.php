<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ParalizaciontalleresController extends BaseController {

    private $_model;

    function init() {
        parent::init('log.tall.paralizaciontalleres');
        $this->_model = new ParalizacionTalleresModel();
    }

    public function gestParalizaciontalleresAction() {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.tall.paralizaciontalleres');
        $this->rendertemplate();
    }

    public function getEstructurasAction() {
        $this->objectHelper->synchronize($this, $this->_model->getEstructuras());
    }

    public function getMediosParalizadosAction() {
        $this->uiParams['filter'] = json_decode($this->_getAllParams()['filter']);
        $result = $this->_model->getMediosParalizados($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }

    public function getEdadesAction() {
        $result = $this->_model->cargarEdades($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }

    public function cargarSectorAction() {
        $result = $this->_model->cargarSector($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }

    public function getEstructurasPorDominioAction() {
        $dat = $this->estructuraHelper->getEntidadesByDominio($this->global->Perfil->iddominio);
        $result = $this->_model->addResultLimits($dat, $this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }

    public function cargarTiposMediosAction() {
        $maestro = new MaestroProductoModel();
        $result = $maestro->devolverPadresHojas($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }

    public function cargarMarcasAction() {
        $result = $this->_model->cargarMarcas($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }

    public function cargarModelosAction() {
        $result = $this->_model->cargarModelos($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }

    public function cargarClientesbaAction() {
        $result = $this->_model->cargarClientesobtenidos($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }

    public function cargarPiezasFaltantesAction() {
        if ($this->uiParams['idordentrabajo']) {
            $result = $this->_model->cargarPiezasFaltantesDeUnaOrden($this->uiParams);
        } else {
            $result = $this->_model->cargarPiezasFaltantes($this->uiParams);
        }
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }

    public function exportarExcelAction() {
        $this->unsetParam('limit');
        $this->unsetParam('start');
        $this->dirFichero = $this->_model->crearExcel($this->uiParams);
    }

    public function cargarProveedoresAction() {
        $result = $this->_model->cargarProveedores($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function imprimirexcelenbaseAction() {
        $this->uiParams['filter'] = json_decode($this->_getAllParams()['filter']);
        $this->dirFichero = $this->_model->crearexcelparalizadosenbase($this->uiParams);
    }

    public function imprimirexcelresumengeneralAction() {
        $this->uiParams['filter'] = json_decode($this->_getAllParams()['filter']);
        $this->dirFichero = $this->_model->imprimirexcelresumengeneral($this->uiParams);
    }

}
