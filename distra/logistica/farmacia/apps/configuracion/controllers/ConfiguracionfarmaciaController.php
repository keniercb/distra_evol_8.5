<?php
/**
 * @class   ConfiguracionfarmaciaController
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

class ConfiguracionfarmaciaController extends BaseController
{
    private $_modelo;

    function init()
    {
        parent::init('log.farm.configuracion');
        $this->_modelo = new  ConfiguracionFarmaciaModel();
    }

    public function configuracionfarmaciaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.farm.configuracion');
        $this->renderTemplate();
    }

    public function cargarAnnosAction()
    {
        $result = $this->_modelo->cargarAnnos($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }
    public function adicionarAnnosAction()
    {
        try {
            $this->_modelo->adicionarAnnos($this->uiParams);
        }
        catch (Exception $e) {
            $this->message = $e->getMessage();
            $this->success = false;
            //throw $e;
        }
    }

    public function modificarAnnoAction()
    {
        try {
            $pepe=json_decode($this->uiParams['filas'],TRUE);

            $this->_modelo->modificarAnnos($pepe);

        }
        catch (Exception $e) {
            $this->message = $e->getMessage();
            $this->success = false;
            //throw $e;
        }
    }

    public function eliminarAnnoAction()
    {
        $this->_modelo->eliminarAnno(Zend_Json::decode($this->uiParams['id']));
    }
    public function duplicarAnnoAction()
    {
        $this->_modelo->duplicarAnno($this->uiParams);
    }
    public function aprobarAnnoAction()
    {
        $this->_modelo->aprobarAnno($this->uiParams);
    }
    public function cerrarAnnoAction()
    {
        $this->_modelo->cerrarAnno($this->uiParams);
    }
    public function activarAnnoAction()
    {
        try  {
            $this->_modelo->activarAnno($this->uiParams);
        }
        catch ( Exception $e) {
            $this->success =  false;
            $this->message =  $e->getMessage();
        }
    }

    public function cargarGrupoFarmacologicoAction()
    {
        $resp = $this->_modelo->cargarGrupoFarmacologico($this->uiParams);
        //$this->jsonResponse($resp['datos']);
        $this->datos = $resp['datos'];
        $this->cantidad = $resp['cantidad'];
    }

    public function cargarFormaFarmaceuticaAction()
    {
        $this->objectHelper->synchronize($this, $this->_modelo->cargarFormaFarmaceutica($this->uiParams));
        /*$resp =$this->_modelo->cargarFormaFarmaceutica($this->uiParams);        
        $this->jsonResponse($resp['datos']);*/
    }

    public function guardarTipoEntidadAsociadasAction()
    {
        $this->uiParams['idtipoentidad'] = Zend_Json::decode($this->uiParams['idtipoentidad']);
        $this->_modelo->guardarTipoEntidadAsociadas($this->uiParams);
    }
    public function cargarTipoEntidadAsociadasAction()
    {
        if($this->uiParams['soloasociadas']){
            $result = $this->_modelo->soloAsociadas($this->uiParams);
            $this->datos =$result;
        }
        else {
            $result = $this->_modelo->cargarTipoEntidadAsociadas($this->uiParams);
            $this->datos =$result;
        }
    }

    public function cargarCodificadorAction()
    {
        try {
            $result = $this->_modelo->cargarCodificador($this->uiParams);
            $this->datos = $result['datos'];
            $this->cantidad = $result['cantidad'];
        }
        catch (Exception $e) {
            $this->message = $e->getMessage();
            $this->success = false;
        }
    }
    public function adicionarCuadroBasicoAction()
    {
       $this->datos = $this->_modelo->adicionarCuadroBasico($this->uiParams);
    }
    public function eliminarCuadroBasicoAction()
    {
        $this->_modelo->eliminarCuadroBasico(Zend_Json::decode($this->uiParams['id'])[0]);
    }
    public function cargarCuadroBasicoAction()
    {
        $result = $this->_modelo->cargarCuadroBasico($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }
    public function cargarUnidadSaludDispensacionAction()
    {
        $result = $this->_modelo->cargarUnidadSaludDispensacion($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];

    }

    public function cargarDatosEstructuraAction()
    {
        $this->jsonResponse($this->_modelo->getEstructura());
    }

}