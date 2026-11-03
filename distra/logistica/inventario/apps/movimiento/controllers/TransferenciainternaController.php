<?php

/**
 * @class      TransferenciareaController
 * (Descripcion de la clase, objetivo)
 *
 * @package    Inventario
 * @subpackage Movimiento
 * @author     Manuel Yhon Figueroa y Antonio Diaz Soutuyo
 * @copyright  XETID
 * @version    1.0
 */
class TransferenciainternaController extends MovimientosController
{
    //private $model;

    public function init()
    {
        $this->arrayData = array('alias' => 'transferenciainternaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV);
        parent::init('log.inv.transferenciainterna');
        //$this->model = new TransferenciainternaModel();
    }

    public function transferenciainternaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array(
            $this->servConfGeneral->mostrarNomencladoresGenerales(),
            $this->servConfGeneral->ObtenerJSArbolNaturaleza()
        );
        $this->initComponent('log.inv.transferenciainterna');
        $this->renderTemplate();
    }

    /**
     * Cargar los combobox de las areas de origen y destino
     * @return array
     */
    public function cargarAreasOrigenDestinoAction()
    {
        $this->objectHelper->synchronize($this,$this->model->cargarAreasOrigenDestino($this->uiParams));
    }

    /**
     * Carga los combobox de las areas origen y destino
     * por una transferencia entre areas
     * @return array
     */
    public function cargarAreasXTipoTransferenciaAction()
    {
        $this->datos = $this->model->cargarAreasXTipoTransferencia($this->uiParams['iddeposito']);
    }

    public function cargarArbolOrigenAction()
    {
        $this->objectHelper->synchronize($this, $this->model->obtenerUbicacionProducto($this->uiParams));
    }

    public function cargarArbolDestinoAction()
    {
        $this->objectHelper->synchronize($this, $this->model->obtenerUbicacionDestino($this->uiParams));
    }

    public function cargarCodificadorAction()
    {
        // $model = new TransferenciainternaModel();
        if ($this->uiParams['excluir']) {
            $this->uiParams['excluir'] = json_decode(stripcslashes($this->uiParams['excluir']));
        }
        $datos = $this->model->cargarCodificador($this->uiParams);
        $this->datos = $datos[0];
        $this->cantidad = $datos[1];

    }

    public function cargarLoteAddAction()
    {
        // $model = new TransferenciainternaModel();
        if ($this->uiParams['excluir']) {
            $this->uiParams['excluir'] = json_decode(stripcslashes($this->uiParams['excluir']));
        }
        $datos = $this->model->cargarLoteAdd($this->uiParams);
        $this->datos = $datos[0];
        $this->cantidad = $datos[1];
    }

    public function adicionarTransferanciaInternaAction()
    {
        //$model = new TransferenciainternaModel();
        $params['data'] = Zend_Json::decode($this->uiParams['data']);
        $params['productos'] = Zend_Json::decode($this->uiParams['productos']);
        $params['idprodtransfinterna'] = Zend_Json::decode($this->uiParams['idprodtransfinterna']);
        $params['lote'] = Zend_Json::decode($this->uiParams['lote']);
        $this->datos = $this->model->adicionarTransferanciaInterna($params);
    }

    public function cargarDocumentosAction()
    {
        //$model = new TransferenciainternaModel();
        $datos = $this->model->cargarDocumentos($this->uiParams);
        $this->datos = $datos[0];
        $this->cantidad = $datos[1];
    }

    public function cargarProductosTransferanciaInternaAction()
    {
        // $model = new TransferenciainternaModel();
        $resutl = $this->model->cargarProductosTransferanciaInterna($this->uiParams);
        $this->datos = $resutl['datos'];
        $this->cantidad = $resutl['cantidad'];
    }

    public function guardarLoteAction()
    {
        $this->uiParams['record'] = Zend_Json::decode($this->uiParams['record']);
        //$model = new TransferenciainternaModel();
        $resutl = $this->model->guardarLote($this->uiParams);
    }

    public function cargarLoteAction()
    {
        $resutl = $this->model->cargarLote($this->uiParams);
        $this->datos = $resutl[0];
        $this->cantidad = $resutl[1];
    }

    public function confirmarDocumentoAction()
    {
        $docLog = new DocumentoLogisticaModel();
        $docLog->confirmarDocumento(Zend_Json::decode($this->uiParams['id'])[0]);
    }

    public function anularEstadoDocumentoAction()
    {
        $docLog = new DocumentoLogisticaModel();
        $docLog->anularEstadoDocumento(Zend_Json::decode($this->uiParams['id'])[0]);
    }

    public function aprobarEstadoDocumentoAction()
    {
        $iddocumento = Zend_Json::decode($this->uiParams['id'])[0];
        $validarProductos = $this->model->validarProductosAprobar($iddocumento);
        
        if($validarProductos['error'] == true){
            $this->codigoMsg = 3;
            $this->success = false;
            $this->error = $validarProductos['errMsg'];
            return;
        }

        $this->model->aprobarDocumento($iddocumento);
    }

    public function eliminarLoteAction()
    {        
        $this->uiParams['arrLoteDel'] = Zend_Json::decode($this->uiParams['arrLoteDel']);
        $this->model->eliminarLote($this->uiParams);
    }
    
    public function eliminarProductosTransfInternaAction()
    {
        $this->uiParams['arrelimprodlogica'] = Zend_Json::decode($this->uiParams['arrelimprodlogica']);
        $this->model->eliminarProductosTransfInterna($this->uiParams);
    }
    
    public function adicionarProductosTransfInternaAction()
    {
        $this->uiParams['productos'] = Zend_Json::decode($this->uiParams['productos']);       
        $this->model->adicionarProductosTransfInterna($this->uiParams); 
    }
    
    public function getValidarConfirmarAction()
    {
         $validarDoc = $this->model->getValidarConfirmar($this->uiParams);
         $this->msg = $validarDoc['msg'];

    }

    public function cargarOperacionesOrigenAction()
    {
        $model = new TransferenciainternaModel();
        $this->objectHelper->synchronize($this, $model->cargarOperacionesOrigen());
    }

    public function cargarOperacionesDestinoAction()
    {
        $model = new TransferenciainternaModel();
        $this->objectHelper->synchronize($this, $model->cargarOperacionesDestino());
    }

    

}