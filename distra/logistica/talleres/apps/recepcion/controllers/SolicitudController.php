<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(
        get_include_path() . PATH_SEPARATOR . $config['include_path']
    );
}

/**
 * @class     GestSolicitudController
 * Clase que se encarga de manejar las acciones
 * para la recepción de las solicitudes.
 * @namespace Logistica\Talleres\Recepcion\Controllers
 * @author    Divisiçon de Gestiçon de Entidades
 * @copyright XETID
 * @version   1.0
 */
class SolicitudController extends BaseController
{

    protected $_solicitudModel, $_modeloOrden, $_arrayDataOrd, $_arrayData;

    public function init()
    {
        parent::init('log.tall.recepciontaller');
        $this->_arrayData = array('alias' => 'solServicio');
        $this->_arrayDataOrd = array('alias' => 'ordenServicioLOG');
        $this->_arrayData['isPrincipal'] = true;
        $this->_arrayDataOrd['isPrincipal'] = true;
        $aperturaAFT = LogisticaGlobal::__init()->estaAperturadoSubsistema(
            LogisticaGlobal::SUBSISTEMA_AFT
        );
        $this->_solicitudModel = new SolicitudModel($this->_arrayData, $aperturaAFT);
        $this->_modeloOrden = new OrdenTrabajoTalleresModel($this->_arrayDataOrd, $aperturaAFT);
        $this->view->uiVariables = array_merge(
            array('existeAFT' => json_encode($aperturaAFT)), $this->view->uiVariables
        );
    }

    public function gestSolicitudAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.tall.recepciontaller');
        $this->renderTemplate();
    }

    public function cargarSolicitudesAction()
    {
        $result = $this->_solicitudModel->devolverSolicitudes($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function adicionarSolicitudAction()
    {
        $this->iddocumento = $this->_solicitudModel->adicionarSolicitud(
            $this->uiParams['data']
        );
    }

    public function eliminarSolicitudAction()
    {
        $this->uiParams['iddocumento'] = Zend_Json::decode(
            $this->uiParams['id']
        );
        $this->datos = $this->_solicitudModel->eliminarSolicitud(
            $this->uiParams['iddocumento']
        );
    }

    public function confirmarSolicitudAction()
    {
        $this->uiParams['iddocumento'] = implode(
            ',', Zend_Json::decode($this->uiParams['id'])
        );
        $this->success = $this->_solicitudModel->confirmarSolicitud(
            $this->uiParams['iddocumento']
        );
    }

    public function anularEstadoSolicitudAction()
    {
        $this->uiParams['iddocumento'] = implode(
            ',', Zend_Json::decode($this->uiParams['id'])
        );
        $this->success = $this->_solicitudModel->anularEstadoSolicitud(
            $this->uiParams['iddocumento']
        );
    }

    public function adicionarServiosAction()
    {
        $resultado = $this->_solicitudModel->serviosExistenetes($this->uiParams);
        $this->datos = $resultado['datos'];
        $this->cantidad = $resultado['total'];
    }

    public function eliminarServiosAction()
    {
        $servicos = Zend_Json::decode($this->uiParams['datos']);
        $this->success = $this->_solicitudModel->eliminarServicios($servicos);

    }

    public function devolverServiosAction()
    {
        if ($this->uiParams['idplansolicitud']) {
            $result = $this->_solicitudModel->devolverServicios($this->uiParams);
        }
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function aprobarSolicitudAction()
    {
        $this->uiParams['iddocumento'] = implode(
            ',', Zend_Json::decode($this->uiParams['id'])
        );
        $this->success = $this->_solicitudModel->aprobarSolicitud(
            $this->uiParams['iddocumento']
        );
    }

    public function soliciduesEstadoAprobadoAction()
    {
        $result = $this->_solicitudModel->devolverSolicitudesAprobadas(
            $this->uiParams
        );
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function soliciduesTercerosEstadoAprobadoAction()
    {
        $result = $this->_solicitudModel->devolverSolicitudesTercerosAprobadas(
            $this->uiParams
        );
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarClientesAction()
    {
        $this->datos = $this->_solicitudModel->devolverTecnicos();
    }

    public function cargarEntidadAction()
    {
        $this->datos = array(
            'identidad'    => $this->global->Estructura->idestructura,
            'denominacion' => $this->global->Estructura->denominacion
        );
    }

    public function actualizarPrioridadAction()
    {
        $datos = Zend_Json::decode($this->uiParams['datos']);
        $this->success = $this->_solicitudModel->actualizarPrioridades($datos);
    }

    public function cargarActividadesExistentesAction()
    {
        $result = $this->_solicitudModel->cargarActividadesExistentes(
            $this->uiParams
        );
        $this->datos = $result['datos'];
        $this->cantidad = $result['totalpaginado'];
    }

    public function cargarEstructurasAction()
    {
        $result = $this->_solicitudModel->cargarEstructuras(
            $this->uiParams
        );
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarEnviadosATallerAction()
    {
        if ($this->uiParams['tipo'] == 2) {
            $result = $this->_solicitudModel->devolverEnviadosAReparar($this->uiParams);
            $this->datos = $result['datos'];
            $this->cantidad = $result['cantidad'];
        } else {
            $result = $this->_modeloOrden->devolverEnviadosAReparar($this->uiParams);
            $this->datos = $result['datos'];
            $this->cantidad = $result['cantidad'];
        }
    }


}
