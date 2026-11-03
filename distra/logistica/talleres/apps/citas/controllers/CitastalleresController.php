<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

/**
 * @class      CitastalleresController
 * @package
 * @subpackage
 * @author    Nardy Roman Padron
 * @copyright XETID
 * @version   1.0
 */
class CitastalleresController extends BaseController//Zend_Controller_Action//
{
    private $_modeloOrden, $_modelReports, $_serviciosCentroCosto, $_arrayData, $_aperturaINV, $_aperturaFAC, $_dualidadMonedas, $_dualidad;
    
    public function init()
    {
        $this->_arrayData = array('alias' => 'citasLog');
        $this->_arrayData['isPrincipal'] = true;
        parent::init('log.tall.citas');
        $aperturaAFT = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_AFT);
        $this->_aperturaINV = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_INV);
        $this->_arrayData['aperturadoFAC'] =
        $this->_aperturaFAC = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_FAC);
        $naturalezaPPA = IntegracionNomencladoresModel::NATURALEZA_PPA;
        $this->_modeloOrden = new CitasTalleresModel($this->_arrayData, $aperturaAFT);
        $monedaAlternativa = LogisticaGlobal::__init()->getMonedaEntidad();
        $data = $this->configuracionHelper->ObtenerDocumentoPrimPorId($this->_modeloOrden->getIddoc());
        $this->_dualidadMonedas = LogisticaGlobal::__init()->getMonedaEntidad();//reemplazar lo viejo por esto
        $this->_dualidad = ($this->_dualidadMonedas->idmonedaalternativa) ? 1 : 0;
        $depositos = $this->_modeloOrden->getDepositosEntidad(array());
        $this->view->uiVariables = array_merge(
            array('existeAFT' => json_encode($aperturaAFT), 'existeINV' => json_encode($this->_aperturaINV),
                'naturalezaPPA' => $naturalezaPPA, 'monedaAlternativa' => json_encode($monedaAlternativa->codigoisoalt),
                'aperturadoFAC' => json_encode($this->_aperturaFAC),
                'reportSpace' => empty($data->dirreporte) ? 'false' : "'$data->dirreporte'",
                'monedacontable' => "'" . "{$this->_dualidadMonedas->codigoiso}" . "'",
                'monedaalternativa' => $this->_dualidad == 1 ? "'".$this->_dualidadMonedas->codigoisoalt."'" : "''",
                'idcontable' => "'" . "{$this->_dualidadMonedas->idmoneda}" . "'",
                'idalternativa' => $this->_dualidad == 1 ? "'".$this->_dualidadMonedas->idmonedaalternativa."'" : "''",
                'depositos' => json_encode($depositos)
            ), $this->view->uiVariables
        );
        if ($this->_aperturaINV) {
            $this->_serviciosCentroCosto = ServiciosContabilidadFinanzasHelper::__init();
        }
    }

    public function gestcitastalleresAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array($this->configuracionHelper->mostrarNomencladoresGenerales());
        $this->initComponent('log.tall.citas');
        $this->renderTemplate();
    }

    public function cargarCitasAction()
    {
        $params = $this->uiParams;
        $params['recsolicitudservicio'] = true;
        $resultado = $this->_modeloOrden->devolverCitas($params);
        $this->datos = $resultado['datos'];
        $this->cantidad = $resultado['cantidad'];
    }

    public function cargarActividadesCitaAction()
    {

        $params = $this->uiParams;
        $resultado = $this->_modeloOrden->cargarActividades($params);
        $this->datos = $resultado['datos'];
        $this->cantidad = $resultado['cantidad'];
    }

    public function cargarMaterialesExistentesAction()
    {
        $resultado = $this->_modeloOrden->devolverMaterialesExistentes($this->uiParams);
        $this->datos = $resultado['datos'];
        $this->cantidad = $resultado['cantidad'];
    }



    public function cargarActividadesExistentesAction()
    {

        $parametros = $this->uiParams;

        $parametros['idservicio'] = Zend_Json::decode($this->uiParams['idservicio']);
        $parametros['excluir'] = Zend_Json::decode($this->uiParams['excluir']);
        $parametros['idtipoprecio'] = Zend_Json::decode($this->uiParams['idtipoprecio']);
        $parametros['idcliente'] = Zend_Json::decode($this->uiParams['idcliente']);
        if ($parametros['todo']) {
            $parametros['nivel'] = 4;
            $parametros['idservicio'] = null;
        }
        $result = $this->_modeloOrden->cargarActividadesExistentes($parametros);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];

    }

    public function adicionarDocumentoAction()
    {
        $parametros = Zend_Json::decode($this->uiParams['data']);
        $listActividades = Zend_Json::decode($this->uiParams['listasactividades']);
        $listPiezasDisp = Zend_Json::decode($this->uiParams['listasmateriales']);

        $datosMedio = $this->uiParams['datosdinamicosmedio'];
        $resultado = $this->_modeloOrden->adicionarCita(
            $listActividades, $listPiezasDisp, $datosMedio, $parametros
        );
        if ($resultado['documento']) {
            $doc = $resultado['documento'];
            $existencia = $this->_modeloOrden->comprobarExistenciaTotalOrden($doc['iddocumento']);
            $doc['estadoorden'] = $existencia;
            $this->datos = $doc;
            $this->existiaactividad = $resultado['algunaactvexistia'];
        }
        if ($resultado['identificadorduplicado']) {
            $this->success = false;
            $this->errorAtribIdentificador = true;
        }
    }

    public function cargarDatosMedioAction()
    {
        $this->datos = $this->_modeloOrden->devolverDatosMedio($this->uiParams['idcita']);
    }

    public function cargarClientesAction()
    {
        $this->datos = $this->_modeloOrden->cargarClientes($this->uiParams['data']);
    }

    public function eliminarDocumentoAction()
    {
        $iddocumento = Zend_Json::decode($this->uiParams['id']);
        $this->datos = $this->_modeloOrden->eliminarOrden($iddocumento, $this->uiParams['integrarfacturacion']);
    }

    public function confirmarDocumentoAction()
    {
        $iddocumento = Zend_Json::decode($this->uiParams['id']);
        $this->datos = $this->_modeloOrden->confirmarOrden($iddocumento[0]);
    }

    public function anularEstadoDocumentoAction()
    {
        $iddocumento = Zend_Json::decode($this->uiParams['id']);
        if ($this->uiParams['rectificar']) {
            $this->datos = $this->_modeloOrden->rectificarOrden($iddocumento[0]);
        } else {
            $this->datos = $this->_modeloOrden->anularOrden($iddocumento[0]);
        }

    }

    public function aprobarDocumentoAction()
    {
        $correocliente = Zend_Json::decode($this->uiParams['correocliente']);
        $iddocumento = Zend_Json::decode($this->uiParams['id']);
        $this->datos = $this->_modeloOrden->aprobarCita($correocliente,$iddocumento[0]);
    }

    public function cargarPersonasAction()
    {
        $result = $this->_modeloOrden->cargarPersonas($this->global->Estructura->idestructura, $this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarPersonasAreaInternaAction()
    {
        $this->datos = $this->_modeloOrden->cargarPersonasAreaIinterna($this->uiParams['idarea'], $this->uiParams);
    }

    public function cargarMediosAction()
    {
        $limit = Zend_Json::decode($this->uiParams['limit']);
        $start = Zend_Json::decode($this->uiParams['start']);
        $busqueda = $this->uiParams['busqueda'];
        $idestructura = Zend_Json::decode($this->uiParams['idestructura']);
        $this->datos =
            array('idestructura' => $idestructura, 'busqueda' => $busqueda, 'start' => $start, 'limit' => $limit);
    }

    public function cargarEntidadAction()
    {
        $this->datos = array('identidad' => $this->global->Estructura->idestructura,
            'nomentidad' => $this->global->Estructura->denominacion);
    }

    public function cargarMonedasEntidadAction()
    {
        $this->datos = $this->_modeloOrden->devolverMonedasContables();
    }

    public function cargarPosiblesFallasDelMedioAction()
    {
        $resultado = $this->_modeloOrden->cargarPosiblesFallasDelMedio($this->uiParams);
        $this->datos = $resultado['datos'];
        $this->cantidad = $resultado['cantidad'];
    }

    public function cargarFallasDetectadasAlMedioAction()
    {
        $respuesta = $this->_modeloOrden->cargarFallasDetectadasAlMedio($this->uiParams);
        $this->datos = $respuesta['datos'];
        $this->cantidad = $respuesta['cantidad'];
    }

    public function comprobarExistenciaMaterialAction()
    {
        $params = Zend_Json::decode($this->uiParams['idsindicador']);
        $this->datos = $this->_modeloOrden->comprobarExistenciaMaterial($params);
    }

    public function cargarAreasInternasAction()
    {
        if ($this->uiParams['usarsubordinacion'] == 1) {
            $this->datos = $this->_modeloOrden->cargarAreasTallerPorSubordinacion($this->uiParams);
        } else {
            $this->datos = $this->_modeloOrden->cargarEstructurasNoFormalesInternas();
        }
    }

    /**
     *
     */
    public function cargarIndicadoresRecuperablesAction()
    {
        $result = $this->_modeloOrden->devolverIndicadoresRecuperables($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    /**
     *
     */
    public function cargarPiezasRetiradasAction()
    {

        $result = $this->_modeloOrden->cargarPiezasRetiradas($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    /**
     *
     */
    public function getCargarEnviadosATallerAction()
    {

        $result = $this->_modeloOrden->devolverEnviadosAReparar($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->total = $result['total'];
    }

    /**
     *
     */
    public function getCargarEnviadosAMantenimientoAction()
    {

        $result = $this->_modeloOrden->devolverEnviadosAMantenimiento($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->total = $result['total'];
    }

    /**
     * @method Metodo para mostrar los reportess
     * @params array $data Arreglo con el parametro filters
     *
     * @return Reporte creado
     */
    public function reporteAction()
    {
        $this->autoShow = false;
        $datas = json_decode(base64_decode($this->uiParams['datas']));
        //        $datas->headers = "vHeaders";
        $datas->flags = true;
        $this->_modelReports->report($datas);
    }

    public function cargarActivoAction()
    {
        $this->datos = $this->_modeloOrden->devolverActivo($this->uiParams);
    }

    public function cargarComboCentroCostoAction()
    {
        if ($this->_aperturaINV) {
            $result = $this->contabilidadHelper->obtenerCentrosCostoFiltro(
                $this->global->Estructura->idestructura, 0, 1000,
                $this->uiParams['criterio']
            );
            $this->datos = $result;
            $this->cantidad = count($result);
        } else {
            $this->datos = array();
        }
    }

    public function cargarDestinosAction()
    {
        $result = $this->_modeloOrden->cargarDestinos($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function generarPedidoAction()
    {
        $this->uiParams['idcliente'] = Zend_Json::decode($this->uiParams['idcliente']);
        $this->uiParams['idcita'] = Zend_Json::decode($this->uiParams['idcita']);
        $this->datos = $this->_modeloOrden->generarPedido($this->uiParams);
    }

    public function cargarPedidosAction()
    {
        $result = $this->_modeloOrden->cargarPedidos($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarServiciosPedidoAction()
    {
        $result = $this->_modeloOrden->cargarServiciosPedido($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarSolicitudesAprobadasAction()
    {
        $result = $this->_modeloOrden->cargarSolicitudesAprobadas($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarSolicitudesATercerosAprobadasAction()
    {
        $result = $this->_modeloOrden->cargarSolicitudesATercerosAprobadas($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarAgenciaAction()
    {
        $result = $this->_modeloOrden->cargarAgencia($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarTiposDePrecioPiezasAction()

    {
        $result = $this->_modeloOrden->cargarTiposDePrecioPiezas($this->uiParams);
        $this->datos = $result;
        $this->cantidad = count($result);
    }

    public function cargarTiposDePrecioActividadesAction()
    {
        $result = $this->_modeloOrden->cargarTiposDePrecioActividades($this->uiParams);
        $this->datos = $result;
        $this->cantidad = count($result);

    }

    /**
     * @return boolean
     */
    public function anularDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->_modeloOrden->cancelarDocumentoTalleres($this->uiParams['iddocumento']);
    }

    /**
     * Crea un nuevo documento a partir de otro previamente establecido.
     * @author Kenier Cumba Bueno
     * @return Boolean
     */
    public function copiarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->datos = $this->_modeloOrden->copiarDocumento($this->uiParams['iddocumento']);
    }

    //Metodos para las citas

    /**
     * @descripcion: Devuelve las cargarPiezasDisp asociadas a los servicios seleccionados en la Cita.
     */
    public function cargarPiezasDispAction()
    {
        $params = $this->uiParams;
        $result = $this->_modeloOrden->cargarPiezasDisp($params);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

}
