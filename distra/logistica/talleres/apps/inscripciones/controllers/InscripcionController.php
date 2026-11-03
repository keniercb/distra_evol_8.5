<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
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
class InscripcionController extends BaseController
{

    protected $_inscripcionModel, $_modeloOrden, $_arrayData, $_arrayDataOrd;

    public function init()
    {
        parent::init('log.tall.inscripciones');
        $this->_arrayData = array('alias' => 'INS');
        $this->_arrayData['isPrincipal'] = true;
        $this->_arrayDataOrd['isPrincipal'] = true;
        $this->_inscripcionModel = new InscripcionModel($this->_arrayData);
        $this->_arrayDataOrd = array('alias' => 'ordenServicioLOG');
        $this->_arrayDataOrd['aperturadoFAC'] =
        $this->aperturaFAC = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_FAC);
        $aperturaAFT = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_AFT);
        $aperturaINV = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_INV);
        $this->_modeloOrden = new OrdenTrabajoTalleresModel($this->_arrayDataOrd, $aperturaAFT);
        $monedaAlternativa = $this->_modeloOrden->devolverMonedasAlternativa();
        $this->view->uiVariables = array_merge(
            array(
                'existeAFT'         => json_encode($aperturaAFT), 'existeINV' => json_encode($aperturaINV),
                'monedaAlternativa' => json_encode($monedaAlternativa),
                'aperturadoFAC'     => json_encode($this->aperturaFAC)
            ), $this->view->uiVariables
        );
    }

    public function gestInscripcionAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.tall.inscripciones');
        $this->renderTemplate();
    }

    public function cargarInscripcionesAction()
    {
        $result = $this->_inscripcionModel->devolverInscripciones($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function eliminarInscripcionAction()
    {
        $this->uiParams['iddocumento'] = Zend_Json::decode($this->uiParams['id']);
        $this->success = $this->_inscripcionModel->eliminarInscripcion($this->uiParams['iddocumento']);
    }

    public function confirmarInscripcionAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->_inscripcionModel->confirmarInscripcion($this->uiParams['iddocumento']);
    }

    public function anularEstadoInscripcionAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->_inscripcionModel->anularEstadoInscripcion($this->uiParams['iddocumento']);
    }

    public function aprobarInscripcionAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->_inscripcionModel->aprobarInscripcion($this->uiParams['iddocumento']);
    }

    public function generarDatosAction()
    {
        $datos = Zend_Json::decode($this->uiParams['datos']);
        $result = $this->_inscripcionModel->inscripcionesParaOrden($datos);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function generarOrdenAction()
    {
        $datos = Zend_Json::decode($this->uiParams['datos']);
        $result = $this->_inscripcionModel->datosOrden($datos);
        $this->datos = $result;
        if ($result['estado']) {
            $this->success = true;
        } else {
            $this->success = false;
        }
    }

    public function adicionarInscripcionAction()
    {
        $inscripcion = Zend_Json::decode($this->uiParams['data']);
        $result = $this->_inscripcionModel->adicionarInscripcion($inscripcion);
        if ($result) {
            $this->datos = $result['datos'];
            $this->cantidad = $result['cantidad'];
        } else {
            $this->success = false;
        }
    }


}
