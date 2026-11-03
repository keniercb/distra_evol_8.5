<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}



/**
 *
 */
class ConfiguracionreporteController extends BaseController
{
    public $_confreportemodel, $_sEstrComposicion;
    /**
     *
     */
    function init()
    {
        parent::init('log.aft.configuracionreporte');
        $this->_confreportemodel = new ConfiguracionreporteModel();

    }

    /**
     *
     */
    public function configuracionreporteAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.configuracionreporte');
        $this->renderTemplate();
    }

    public function cargarGridCentralAction()
    {
        $result = $this->_confreportemodel->cargarGridCentral($this->uiParams);
        $this->total = $result[0];
        $this->datos = $result[1];
    }

    public function getGuardarDatosAction()
    {
        try{
            $params = json_decode($this->uiParams['guardar']) ;
            $this->_confreportemodel->getGuardarDatos($params, $this->uiParams['idestructura']);
        } catch (Doctrine_Exception $e){
            echo $e->getMessage();
        }
    }

    public function getEstructuraAction()
    {

        $mComunAFT = ComunAFTModel::getInstance();
        $cEstructura = 'Estructura';
        $estructura = $this->global->$cEstructura->idestructura;
        $params['idconcepto'] = ($this->uiParams['idconcepto'])? $this->uiParams['idconcepto']: 3;
        
        
        /*
        if ($params['idconcepto'] == 5) {
            $params['idsestructura'] = $mComunAFT->getIdsAreasHijas();            
        } else {
            $params['idestructura'] = $estructura;
        }

        $datos = $mComunAFT->cargarEstructuras($params);
        */

        

        if ($params['idconcepto'] == 5) {
            $datos = $mComunAFT->getAreasHijas();
            foreach ($datos['depositos'] as $index => $dat) {
                $datos['datos'][$index]->deposito = $dat['deposito'];
                $datos['datos'][$index]->iddeposito = $dat['iddeposito'];
            }
        } else {
            $params['idestructura'] = $estructura;
            $datos = $mComunAFT->cargarEstructuras($params);
            foreach ($datos['datos'] as $index => $dat) {
                $datos['datos'][$index]->deposito = ($dat->denominacion) ? $dat->denominacion : $dat->denominacionop;
                $datos['datos'][$index]->iddeposito = $dat->idfila;
            }
        }

        
        $this->datos = $datos['datos'];

    }

}
