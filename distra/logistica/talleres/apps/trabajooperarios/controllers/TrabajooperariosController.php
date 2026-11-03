<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class TrabajooperariosController extends BaseController//Zend_Controller_Action//
{
    private $_modeloOrden, $_modelReports, $_serviciosCentroCosto, $_arrayData, $_aperturaINV, $_aperturaFAC, $_dualidadMonedas, $_dualidad;
    
    public function init()
    {
//        $this->_arrayData = array('alias' => 'citasLog');
        $this->_arrayData['isPrincipal'] = true;
        parent::init('log.tall.trabajooperarios');
        $aperturaAFT = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_AFT);
        $this->_aperturaINV = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_INV);
        $this->_arrayData['aperturadoFAC'] =
        $this->_aperturaFAC = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_FAC);
        $naturalezaPPA = IntegracionNomencladoresModel::NATURALEZA_PPA;
        $this->_modeloOrden = new TrabajoOperariosModel($this->_arrayData, $aperturaAFT);
        $monedaAlternativa = LogisticaGlobal::__init()->getMonedaEntidad();
//        $data = $this->configuracionHelper->ObtenerDocumentoPrimPorId($this->_modeloOrden->getIddoc());
        $this->_dualidadMonedas = LogisticaGlobal::__init()->getMonedaEntidad();//reemplazar lo viejo por esto
        $this->_dualidad = ($this->_dualidadMonedas->idmonedaalternativa) ? 1 : 0;

//        $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj($this->global->Estructura->idestructura,
//            LogisticaGlobal::SUBSISTEMA_TALLERES);
//        $objPeriodo = $this->configuracionHelper->getPeriodoActualSubsistema($this->global->Estructura->idestructura,
//            LogisticaGlobal::SUBSISTEMA_TALLERES);
//        $objPeriodo = $this->configuracionHelper->obtenerPeriodo($objPeriodo);

        $this->view->uiVariables = array_merge(
            array('existeAFT' => json_encode($aperturaAFT), 'existeINV' => json_encode($this->_aperturaINV),
                'naturalezaPPA' => $naturalezaPPA, 'monedaAlternativa' => json_encode($monedaAlternativa->codigoisoalt),
                'aperturadoFAC' => json_encode($this->_aperturaFAC),
//                'reportSpace' => empty($data->dirreporte) ? 'false' : "'$data->dirreporte'",
                'monedacontable' => "'" . "{$this->_dualidadMonedas->codigoiso}" . "'",
                'monedaalternativa' => $this->_dualidad == 1 ? "'".$this->_dualidadMonedas->codigoisoalt."'" : "''",
                'idcontable' => "'" . "{$this->_dualidadMonedas->idmoneda}" . "'",
                'idalternativa' => $this->_dualidad == 1 ? "'".$this->_dualidadMonedas->idmonedaalternativa."'" : "''",
//                'V_fecha' => "'" . $fecha->fecha . "'",
//                'V_fechainicio' => "'" . $objPeriodo->inicio . "'",
//                'V_fechafin' => "'" . $objPeriodo->fin . "'",
            ), $this->view->uiVariables
        );
        if ($this->_aperturaINV) {
            $this->_serviciosCentroCosto = ServiciosContabilidadFinanzasHelper::__init();
        }
    }

    public function gesttrabajooperariosAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.tall.trabajooperarios');
        $this->renderTemplate();
    }

    public function cargarPersonasTrabajoAction()
    {
        $params = $this->uiParams;
        $resultado = $this->_modeloOrden->cargarPersonasTrabajo($params);
        $this->datos = $resultado['datos'];
        $this->cantidad = $resultado['cantidad'];
    }

    public function cargarPersonasTrabajoActividadesAction()
    {
        $params = $this->uiParams;
        if ($params['idpersona']) {
            $resultado = $this->_modeloOrden->cargarPersonasTrabajoActividades($params);
            $this->datos = $resultado['datos'];
            $this->cantidad = $resultado['cantidad'];
        } else {
            $this->datos = [];
            $this->cantidad = 0;
        }
    }

    public function cargarActividadesPersonaAction()
    {
        $params = $this->uiParams;
        if ($params['idpersona']) {
            $resultado = $this->_modeloOrden->cargarActividadesPersona($params);
            $this->datos = $resultado['datos'];
            $this->cantidad = $resultado['cantidad'];
        } else {
            $this->datos = [];
            $this->cantidad = 0;
        }
    }

    public function cargarActividadesPadrePersonaAction()
    {
        $params = $this->uiParams;
        if ($params['idpersona']) {
            $resultado = $this->_modeloOrden->cargarActividadesPadrePersona($params);
            $this->datos = $resultado['datos'];
            $this->cantidad = $resultado['cantidad'];
        } else {
            $this->datos = [];
            $this->cantidad = 0;
        }
    }

    public function cargarDatosEjerMesAction()
    {
        $result = $this->_modeloOrden->cargarDatosEjerMes($this->global->Estructura->idestructura, $this->uiParams);
        $this->datos = $result;
//        $this->cantidad = $result['cantidad'];
    }

    public function cargarMesesAction()
    {
        $result = $this->_modeloOrden->cargarMeses($this->uiParams['idejercicio']);
        $this->datos = $result;
//        $this->cantidad = $result['cantidad'];
    }

    public function cargarPersonasAction()
    {
        $result = $this->_modeloOrden->cargarPersonas($this->global->Estructura->idestructura, $this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function guardarDatosAction()
    {
        $result = $this->_modeloOrden->guardarDatos($this->global->Estructura->idestructura, $this->uiParams);
        $this->success = $result;
    }

    public function cargarAreasDelTallerAction()
    {
        $resultado = $this->_modeloOrden->cargarAreasDelTaller($this->uiParams /*$this->global->Perfil->iddominio */);
        $this->datos = $resultado;
        $this->cantidad = count($resultado);
    }

    public function cargarBonPenAction()
    {
        $this->objectHelper->synchronize(
            $this,
            $this->_modeloOrden->cargarBonPen($this->uiParams)
        );
    }

    public function addBonPenAction()
    {
        $this->objectHelper->synchronize(
            $this,
            $this->_modeloOrden->addBonPen($this->uiParams)
        );
    }

    public function cancelarBonPenAction()
    {
        $this->objectHelper->synchronize(
            $this,
            $this->_modeloOrden->cancelarBonPen($this->uiParams)
        );
    }

    public function aprobarSalarioAction()
    {
        $this->objectHelper->synchronize(
            $this,
            $this->_modeloOrden->aprobarSalario($this->uiParams)
        );
    }

    public function desAprobarSalarioAction()
    {
        $this->objectHelper->synchronize(
            $this,
            $this->_modeloOrden->desAprobarSalario($this->uiParams)
        );
    }

}
