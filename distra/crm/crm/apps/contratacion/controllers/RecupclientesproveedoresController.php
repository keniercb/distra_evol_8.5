<?php
class RecupclientesproveedoresController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
        $this->_responeInfo = new ResponseInfo();
        $this->_clientProveedDService = new ClientesProveedoresDService();
        $this->_clientProveedExportDService = new ClientesProveedoresExportDService();
    }

    function recupclientesproveedoresAction()
    {}

    public function getClientesProveedoresAction()
    {
         $listClientP = $this->_clientProveedDService->getClientesProveedores(
             array(
                 'limit'=> $this->_getParam('limit', 20),
                 'start'=> $this->_getParam('start', 0),
                 'filters'=> Zend_Json::decode($this->_getParam('filter', array()))
             )
         );
         $this->_responeInfo->datos = $listClientP['data'];
         $this->_responeInfo->cantidad = $listClientP['cant'];

         echo $this->_responeInfo->getJson();
    }

    public function getClienteProveedorDetallesAction()
    {
        $this->_responeInfo->datos= $this->_clientProveedDService->getClienteProveedorDetalles($this->_getParam('idclienteproveedor', 0));
        
        echo $this->_responeInfo->getJson();
    }

    public function exportarDatosAction()
    {
        $this->_clientProveedExportDService->exportarDatos(array(
            'filters'=> Zend_Json::decode($this->_getParam('filter', array()))
        ));
    }
}
