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

class ConfiguraciongeneralController extends BaseController
{
    private $_modelo;

    function init()
    {
        parent::init('log.farm.configuracion');
        $this->_modelo = new  ConfGeneralModel();

    }

    public function configuraciongeneralAction()
    {
        $this->autoShow = false;
        $this->render();
    }

    public function cargarDepositoAction()
    {
        $datos = $this->_modelo->cargardepositos();
        $this->datos = $datos;
    }

    public function getGuardarDatosAction()
    {
        try{
            $cEstructura = 'Estructura';
            $cEstructura = $this->global->$cEstructura->idestructura;
            $this->uiParams['datos'] = json_decode(stripcslashes($this->uiParams['datos']));
            $this->uiParams['datos']->idestructura = $cEstructura;
            $this->datos = $this->_modelo->getGuardarDatos($this->uiParams);
        }catch (Doctrine_Exception $e){
            $this->msg = $e->getMessage();
            $this->success = false;
        }
    }

    public function cargaInicialAction()
    {
        $cEstructura = 'Estructura';
        $cEstructura = $this->global->$cEstructura->idestructura;
        $this->uiParams['idestructura'] = $cEstructura;
        $datos = $this->_modelo->cargaInicial($this->uiParams);
        $this->datos = $datos[0];
    }
  


}