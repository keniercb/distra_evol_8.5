<?php
/**
 * @class   ReenvaseController
 * @author  Manuel Yhon Figueroa
 * @version 1.1
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(
        get_include_path() . PATH_SEPARATOR . $config['include_path']
    );
}

class ReenvaseController extends BaseController
{
    private $_reenvaseModel;

    public function init()
    {
        parent::init('log.farm.reenvase');
        $this->_reenvaseModel = new ReenvaseModel(array(
            'isPrincipal' => true, 'alias' => 'reenvaseLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_FARMACIA
        ));
        $data = $this->configuracionHelper->ObtenerDocumentoPrimPorId($this->_reenvaseModel->getIddoc());
        $fechacontable = $this->configuracionHelper->getFechaContableSubsistema(
            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FARMACIA
        );
        $fecha = new DateTime();
        $this->view->uiVariables = array_merge(
            array(
                'idespaciotrabajo' => empty($data->idespaciotrabajo) ? 'false' : "'$data->idespaciotrabajo'",
                'reportSpace' => empty($data->dirreporte) ? 'false' : "'$data->dirreporte'",
                'fecha' => "'{$fecha->format('d/m/Y')}'",
                'fechacontable' => "'{$fechacontable}'",
                'alternativa' => 'false',
                'codContable' => "'CUP'",
                'codAlternativa' => "'-'",
                'cargaInicial' => $this->configuracionHelper->subsistemaAperturado($this->global->Estructura->idestructura)
            ), $this->view->uiVariables
        );
    }

    public function reenvaseAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array(
            $this->configuracionHelper->mostrarNomencladoresGenerales(),
            $this->configuracionHelper->ObtenerJSArbolNaturaleza(),
            $this->configuracionHelper->ObtenerJSArbolUM()
        );
        $this->initComponent('log.farm.reenvase');
        $this->renderTemplate();
    }

    public function cargaInicialAction()
    {
        $this->datos = $this->_reenvaseModel->cargaInicial();
    }

    public function cargarDocumentosAction()
    {
        $datos =  $this->_reenvaseModel->devolverDocumentos($this->uiParams);
        $this->datos = $datos['datos'];
        $this->cantidad = $datos['cantidad'];
    }

    public function cargarDepositoAction()
    {
        $datos = $this->_reenvaseModel->cargarDepositos($this->uiParams);
        $this->cantidad = count($datos);
        $this->datos = $datos;
    }

    public function cargarProductosAction()
    {
        $this->uiParams['asentado'] = true;
        $this->unsetParam('idEspecialidad');
        $this->unsetNullValues($this->uiParams['codigoauxiliar']);
        $this->uiParams['tipoproducto'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['tipoproducto'])
        );
        if ($this->uiParams['idnaturalezaexcluir']) {
            $this->uiParams['idnaturalezaexcluir'] = json_decode(
                stripcslashes($this->uiParams['idnaturalezaexcluir'])
            );
        }
        if($this->uiParams['idlineaproducto']){
            $this->uiParams['idlineaproducto'] = explode(',',$this->uiParams['idlineaproducto']);
        }
        $result = $this->_reenvaseModel->cargarProductos($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarLotesAction()
    {
        if ($this->uiParams['excluir']) {
            $this->uiParams['excluir'] = json_decode(stripcslashes($this->uiParams['excluir']));
        }

        $datos = $this->_reenvaseModel->cargarLotes($this->uiParams);
        $this->datos = $datos[0];
        $this->cantidad = $datos[1];
    }

    public function cargarLotesOrigenAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $result = $this->_reenvaseModel->devolverLotes($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarLotesDestinoAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $result = $this->_reenvaseModel->devolverLotes($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function adicionarDocumentoAction()
    {
        $fecha = new DateTime();
        $this->uiParams['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->uiParams['arrayLotes'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['arrayLotes'])
        );
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);
        unset($this->uiParams['data']);
        $this->uiParams['fecha'] = $fecha->format('d/m/Y');
        $this->unsetNullValues();
        $this->objectHelper->synchronize($this, $this->_reenvaseModel->adicionarDocumento($this->uiParams));
    }

    public function adicionarProductoAction()
    {
        $result = $this->_reenvaseModel->adicionarProductoDestino($this->uiParams);
        $this->success = $result['success'];
        $this->data = $result['datosProd'];
    }

    public function eliminarDocumentoAction()
    {
        $this->success = $this->_reenvaseModel->eliminarDocumento(Zend_Json::decode($this->uiParams['id']));
    }

    public function eliminarLotesAction()
    {
        $this->uiParams['idlotes'] = (array) Zend_Json::decode($this->uiParams['idlotes']);
        $this->success = $this->_reenvaseModel->eliminarLotes($this->uiParams);
    }

    public function realizarReenvaseProductoAction()
    {
        $this->uiParams['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);
        unset($this->uiParams['data']);
        $this->unsetNullValues();
        $this->datos = $this->_reenvaseModel->realizarReenvaseProducto($this->uiParams);
    }

    public function confirmarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->_reenvaseModel->confirmarDocumento($this->uiParams['iddocumento']);
    }

    public function anularEstadoDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->_reenvaseModel->anularEstadoDocumento($this->uiParams['iddocumento']);
    }

    public function aprobarEstadoDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->objectHelper->synchronize($this, $this->_reenvaseModel->aprobarDocumento($this->uiParams));
    }

    public function eliminarProductoAction()
    {
        $this->uiParams['datos'] = (array) Zend_Json::decode($this->uiParams['datos']);
        $this->success = $this->_reenvaseModel->eliminarProducto($this->uiParams);
    }
}