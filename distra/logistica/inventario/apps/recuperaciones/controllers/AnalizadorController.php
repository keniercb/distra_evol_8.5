<?php

/**
 *  Esta clase
 * * @copyright XETID
 * @author DIvicion de Gestion de Entidades
 * @version 1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class AnalizadorController extends BaseController
{
    private $model;

    function init()
    {
        parent::init('log.aft.analizador');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->model = new AnalizadorModel();
        $this->confGeneral = ServiciosConfiguracionGeneralHelper::__init();
    }

    public function gestAnalizadorAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('Ext.erp.analizador');
        $this->rendertemplate();
    }

    public function cargarDatosAction()
    {
        $this->datos = $this->model->getDatos();
    }


    public function getActivosByMedidorAction()
    {
        $parametros = $this->uiParams;
        
        $data = $this->model->getDatosPorMedidor($parametros);

        $this->datos = $data['datos'];
        $this->cantidad = $data['total'];
        $this->total = $data['total'];
    }
    // public function obtenerNaturalezaAction()
    // {
    //     $this->autoShow = false;
    //     $params = $this->uiParams;
    //     print_r($params);die;
    //     $result = $this->confGeneral->obtenerDatosArbolNaturaleza($params);
    //    // echo json_encode(array('datos' => $result));
    // }
    public function getNaturalezaAction()
    {
        $parametros = new stdClass();

        // ComunAFTModel::getInstance()->configStartAndLimitInParams(
        //     $parametros,
        //     $this->_request->getPost('start'),
        //     $this->_request->getPost('limit')
        // );
        
        
        $integrator = ZendExt_IoC::getInstance();
        $naturalezas = $integrator->datosmaestros->getNaturalezas(new Doctrine_Query());
        
        $this->datos = $naturalezas;
        $this->cantidad = count($naturalezas);
        $this->total = count($naturalezas);
        //echo json_encode($datos);
    }
    public function listarProductosAction(){
        $this->objectHelper->synchronize($this, $this->model->listarproductos($this->uiParams));
    }

    public function listarDocumentosAction($params)
    {
        $this->objectHelper->synchronize($this, $this->model->listarDocumentos($this->uiParams));
    }
    

}
