<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()
            ->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of VentasdevolucionController
 *
 * @author Javier
 */
class VentasdevolucionController extends BaseController
{
    private $model,$_fechacontable,$_objHelper;

    public function init()
    {
        parent::init('log.fac.ventasdevolucion');
        $this->model = new ComprobanteVentaModel(array('alias' => 'compventaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_FAC));
        $monedas = $this->model->getMonedas();
        $this->_fechacontable = $this->global->FechaContable->fecha;        
        $this->_objHelper = LogisticaObjectHelper::__init();
        $this->view->uiVariables = array_merge(
            array('codigoContable' => "'" . "{$monedas->codigoiso}" . "'",
                'codigoAlternativa' => "'" . "{$monedas->codigoisoalt}" . "'",
                'alternativa' => $monedas->idmonedaalternativa ? 'true' : 'false',
                'monedacontable' => "'" . "{$monedas->idmoneda}" . "'",
                'monedaalternativa' => "'" . "{$monedas->idmonedaalternativa}" . "'",
                'fechacontable' => "'{$this->_fechacontable}'"
            ), $this->view->uiVariables
        );
    }

    public function ventasdevolucionAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array();
        $this->initComponent('log.fac.ventasdevolucion');
        $this->renderTemplate();
        //echo '<pre>';
        //print_r($this);die;

    }

    public function devolverDocumentosAction()
    {
        $this->uiParams['buscar'] = $this->uiParams['criterio'];
        unset($this->uiParams['criterio']);
        $this->objectHelper->synchronize($this, $this->model->getDocumentos($this->uiParams));
    }

    public function devolverMovimientosAction()
    {
        $this->objectHelper->synchronize($this, $this->model->devolverMovimientos($this->uiParams));
    }

    public function obtenerTipoDocumentoAction()
    {
        $this->datos = $this->model->devolverTipoDocumentos();
    }

    public function adicionarCierreAction()
    {   
        $this->uiParams['documentos'] = $this->_objHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['documentos'])
        );
        $resutl = $this->model->guardarCierre($this->uiParams);
    }

    public function DevolverListaCierreAction()
    {
        $this->objectHelper->synchronize($this, $this->model->getListCierre($this->uiParams));
    }

    public function obtenerDatosCierreAction()
    {
        //$this->uiParams['record'] = Zend_Json::decode($this->uiParams['record']);
        //$this->uiParams['params'] = Zend_Json::decode($this->uiParams['params']);
        $this->objectHelper->synchronize($this, $this->model->getCierre($this->uiParams));
    }
    
    public function obtenerVendedorAction()
    {
        $this->objectHelper->synchronize($this, $this->model->getVendedores($this->uiParams));
    }
    
    public function obtenerClientesAction()
    {
        $this->objectHelper->synchronize($this, $this->model->getClientes($this->uiParams));
    }
    
    public function getProductosVentaAction()
    {
        $this->objectHelper->synchronize($this, $this->model->getProductosVenta($this->uiParams));
    }
    
    public function getModoPagoAction()
    {
        $this->objectHelper->synchronize($this, $this->model->getModoPago());
    }

    public function guardarObservacionAction(){
        $this->uiParams['all'] = true;
        $this->objectHelper->synchronize($this, $this->model->guardarObservacion($this->uiParams));
    }

    public function guardarDatosClientesAction(){
        $this->objectHelper->synchronize($this, $this->model->guardarDatosClientes($this->uiParams));
    }  

    public function getCiudadAction(){
        $this->objectHelper->synchronize($this, $this->model->getCiudad());
    }

    public function getMunicipioAction(){
        $this->objectHelper->synchronize($this, $this->model->getMunicipio());
    }

    public function exportarEntregadosAction()
    {
        if ($this->uiParams['idareaventa']) {
            $dir_index = $_SERVER['SCRIPT_FILENAME'];
            $path = substr($dir_index, 0, strrpos($dir_index, 'web')) . 'web/logistica/facturacion/puntoventa/';
            $fileName = 'Entregados-'.date("Ymd").'.xml';
            $xml = $this->model->exportarEntregados($this->uiParams);

            $sxe = new SimpleXMLElement($xml);
            $dom = new DOMDocument('1,0');
            $dom->preserveWhiteSpace = false;
            $dom->formatOutput = true;
            $dom->loadXML($sxe->asXML());

            $dom->saveXML();

            $dom->save($path.$fileName);

            /*$fileName = 'Productos.xml';
            header('Content-Type:text/xml');
            header('Content-Type: application/force-download');
            header("Content-Disposition: attachment; filename=\"{$fileName}\"");
            header('Pragma: no-cache');
            header('Expires: 0');*/

            $this->url = '/logistica/facturacion/puntoventa/'.$fileName;
        }
    }

    public function getDocumentosGeneradosAction()
    {
        $this->objectHelper->synchronize($this, $this->model->getDocumentosGenerados($this->uiParams));
    }

    public function devolverPagosAction()
    {
        $this->objectHelper->synchronize($this, $this->model->devolverPagos($this->uiParams));
    }
    
}
