<?php
/**
 * @class   ConfiguraciontalleresController
 * @author  Daniel Arias Espinosa
 * @version 1.1
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(
        get_include_path() . PATH_SEPARATOR . $config['include_path']
    );
}

class ConfiguracionmediostallerController extends BaseController
{
    private $_modelo, $_aperturaAFT;

    function init()
    {
        parent::init('log.tall.configuracion');
        $this->_aperturaAFT = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_AFT);
        $this->view->uiVariables = array_merge(
            array('existeAFT' => json_encode($this->_aperturaAFT)), $this->view->uiVariables
        );
        $this->_modelo = new ConfiguracionMediosTalleresModel($this->_aperturaAFT);
    }

    public function configuracionmediostallerAction()
    {
        $this->render();
    }

    public function devolverAtributosAction()
    {
        $datos = Zend_Json::decode($this->uiParams['datos']);
        $campos = $this->_modelo->devolverAtributos($datos, $this->_aperturaAFT);
        foreach ($campos['naturaleza'] as &$value) {
            $value->display = html_entity_decode($value->label);
        }
        foreach ($campos['dinamicos'] as &$value) {
            $value->display = html_entity_decode($value->label);
        }
        $this->datos = $campos;
    }

    public function guardarIndicadorAction()
    {
        $datos = Zend_Json::decode($this->uiParams['datos']);
        $this->success = $this->_modelo->guardarIndicador($datos);
    }

    public function eliminarIndicadorAction()
    {
        $datos = Zend_Json::decode($this->uiParams['datos']);
        $this->success = $this->_modelo->eliminarIndicador($datos);
    }

    public function cargarIndicadoresAction()
    {
        $result = $this->_modelo->cargarConfigIndicador($this->uiParams);
        $this->datos = $result['valores'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarDinamicosAction()
    {
        $id = Zend_Json::decode($this->uiParams['id']);
        if ($id) {
            $this->datos = $this->_modelo->devolverAtributosDinamicoIndicador($id);
        }
    }

    public function atributosPorIndicadorAction()
    {
        $id = Zend_Json::decode($this->uiParams['idindicador']);
        $this->datos = $this->_modelo->cargarAtributosPorIndicador($id, $this->uiParams['idw'], $this->uiParams);
    }

    public function indicadorEnUsoAction()
    {
        $datos = Zend_Json::decode($this->uiParams['datos']);
        $this->success = $this->_modelo->indicadorUso($datos);
    }

    public function hacerRecuperableAction()
    {
        $datos = Zend_Json::decode($this->uiParams['datos']);
        $this->success = $this->_modelo->hacerRecuperable($datos);

    }

    public function devolverRecuperablesAction()
    {
        $id = Zend_Json::decode($this->uiParams['idindicador']);
        $result = $this->_modelo->mediosAtributosRecuperables($id);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarTiposMediosAction()
    {
        $maestro = new MaestroProductoModel();
        $this->uiParams['grid'] = true;
        $this->objectHelper->synchronize($this, $maestro->devolverPadresHojas($this->uiParams));
    }


}