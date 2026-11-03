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

class TarjetamedicamentoController extends BaseController
{
    private $_modelo, $_arrayData;

    function init()
    {
        $this->_arrayData = array('alias' => 'tarjetaMedLog');
        $this->_arrayData['isPrincipal'] = true;
        $this->_arrayData['subsistema'] = LogisticaGlobal::SUBSISTEMA_FARMACIA;
        parent::init('log.farm.tarjetamedicamento');
        $this->_modelo = new TarjetaMedicamentoModel($this->_arrayData);
        $configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
        $fecha = $configuracionHelper->getFechaContableSubsistema($this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV);
        $this->view->uiVariables = array_merge(array('fechaactual' => "'".$fecha."'"), $this->view->uiVariables);
    }

    public function tarjetamedicamentoAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.farm.tarjetamedicamento');
        $this->renderTemplate();
    }

    public function cargarTarjetasAction()
    {
        $this->setDefaultParam('start', 0);
        $this->setDefaultParam('limit', 30);
        $resutl =  $this->_modelo->cargarTarjetas($this->uiParams);
        $this->datos = $resutl['datos'];
        $this->cantidad = $resutl['cantidad'];
    }
    public function adicionarTarjetasAction()
    {
        $params['data'] = Zend_Json::decode($this->uiParams['data']);
        $params['productos'] = Zend_Json::decode($this->uiParams['productos']);
        $params['entrega'] = Zend_Json::decode($this->uiParams['entrega']);
        $resul = $this->_modelo->adicionarTarjetaMedicamento($params);
        if($resul['pacientecontarjeta']) {
            $this->pacientecontarjeta = 1;
            $this->success = false;
        }
        else
            $this->datos = $resul['datos'];

             $this->idtarjetamedicamento=$resul['idtarjetamedicamento'];
    }

    public function eliminarTarjetasAction()
    {
       $this->_modelo->eliminarDocumento(Zend_Json::decode($this->uiParams['id'])[0]);
    }

    public function confirmarTarjetasAction()
    {
       $this->_modelo->confirmarDocumento(Zend_Json::decode($this->uiParams['id'])[0]);
    }

    public function anularEstadoTarjetasAction()
    {
        $this->_modelo->anularEstadoDocumento(Zend_Json::decode($this->uiParams['id'])[0]);
    }

    public function aprobarTarjetasAction()
    {
        $this->_modelo->aprobarTarjetas(Zend_Json::decode($this->uiParams['id'])[0]);
    }
    public function aprobarProductoAction()
    {
        $this->_modelo->aprobarProducto(Zend_Json::decode($this->uiParams['id'])[0]);
    }

    public function cargarProductosTarjetaAction()
    {
        $resutl =  $this->_modelo->cargarProductosTarjeta($this->uiParams);
        $this->datos = $resutl['datos'];
        $this->cantidad = $resutl['cantidad'];

    }

    public function adicionarProductosTarjetaAction()
    {
        $params['iddocumento'] = Zend_Json::decode($this->uiParams['iddocumento']);
        $params['productos'] = Zend_Json::decode($this->uiParams['productos']);
        $this->datos = $this->_modelo->adicionarProductosTarjeta($params);
    }

    public function eliminarProductosTarjetaAction()
    {
        $params = Zend_Json::decode($this->uiParams['id']);
        $this->datos = $this->_modelo->eliminarProductosTarjeta($params);
    }

    public function adicionarEntregaProductoAction()
    {
        $params['entrega'] = Zend_Json::decode($this->uiParams['entrega']);
        $this->_modelo->adicionarEntregaProducto($params);
    }

    public function eliminarEntregaProductoAction()
    {
        $params = Zend_Json::decode($this->uiParams['id']);
        $this->datos = $this->_modelo->eliminarEntregaProducto($params);
    }

    public function cargarEntregaProductoAction()
    {
        $params['idventacliente'] = Zend_Json::decode($this->uiParams['idventacliente']);
        $params['idproducto'] = Zend_Json::decode($this->uiParams['idproducto']);
        $params['idproductotarjetamedicamento'] = Zend_Json::decode($this->uiParams['idproductotarjetamedicamento']);
        $result =  $this->_modelo->cargarEntregaProducto($params);
        $this->datos =$result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarAllCuadroBasicoAction()
    {
        $result = $this->_modelo->cargarAllCuadroBasico($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function getPacienteAction()
    {
        $result = $this->_modelo->getPaciente($this->uiParams);
        $this->jsonResponse($result);
    }

    public function cargarPaisesAction()
    {
        $this->datos = $this->configuracionHelper->obtenerPaisesEntidad($this->global->Estructura->idestructura);
    }
    public function cargarProvinciasAction()
    {
        $this->datos = $this->configuracionHelper->cargarEstruturadpa(null, $this->uiParams['idpais']);
    }
    public function cargarMunicipiosAction()
    {
        $this->datos = $this->configuracionHelper->cargarEstruturadpa($this->uiParams['idprov'], null);
    }

    public function renovarProductoTarjetaAction()
    {
        $params['productos'] = Zend_Json::decode($this->uiParams['productos']);
        $params['ids'] = Zend_Json::decode($this->uiParams['ids']);
        $this->datos = $this->_modelo->renovarProductoTarjeta($params);
    }

    public function cambioTratamientoAction()
    {
        $params['productos'] = Zend_Json::decode($this->uiParams['productos']);
        $params['ids'] = Zend_Json::decode($this->uiParams['ids']);
        $this->datos = $this->_modelo->cambioTratamiento($params);

    }
    public function expirarAction()
    {
        $p=$this->uiParams;

        if ($p){
            $this->_modelo->expirar($p);
        }
    }
    public function buscarCuadroBasicoAction()
    {
        $this->objectHelper->synchronize($this, $this->_modelo->buscarCuadroBasico($this->uiParams));

        }

    public function eliminarImportarAction()
    {
        $this->objectHelper->synchronize($this, $this->_modelo->eliminarImportar($this->uiParams));
    }

    public function cargarProductoErrorAction()
    {
        $this->setDefaultParam('start', 0);
        $this->setDefaultParam('limit', 30);
        $this->objectHelper->synchronize($this, $this->_modelo->cargarProductoError($this->uiParams));
    }

    public function imprimirExcelAction()
    {
        $this->dirFichero = $this->_modelo->crearExcelFarmacia();
    }
}