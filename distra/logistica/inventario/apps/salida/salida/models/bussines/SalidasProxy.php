<?php

/**
 * Description of EntradaProxy
 *
 * @author Kenier Cumba Bueno
 */
class SalidasProxy extends SalidaModel
{
    /**
     * @var SalidaModel 
     */
    private $_model;

    public function __construct($datos = array())
    {
        $this->_model = $this->factoryModel($datos);
        parent::__construct($datos);
    }

    public function factoryModel($datos)
    {
        switch ($datos['alias']) {
            case 'solEntrega':
                return new SolicitudentregaModel($datos);
            case 'valeLog':
                return new DocumentosalidaModel($datos);
            case 'conciliacionLog':
                return new ConciliacionLogisticaModel($datos);
            case 'distribucionLog':
                return new DatOrdenModel($datos);
            default:
                return new SalidaModel($datos);
        }
    }

    /**
     * @param $datos
     * @author Kenier Cumba Bueno
     * @return object
     */
    public function getModel()
    {
        return $this->_model;
    }

    public function adicionarDocumento($datosDoc = array())
    {
        return $this->_model->adicionarDocumento($datosDoc);
    }

    public function devolverDocumentos($parametros)
    {
        return $this->_model->devolverDocumentos($parametros);
    }

    /**
     * @param integer $iddocumento
     * @return boolean
     */
    public function eliminarDocumento($iddocumento)
    {
        return $this->_model->eliminarDocumento($iddocumento);
    }

    public function devolverMovimientos($query, $iddocumento)
    {
        return $this->_model->devolverMovimientos($query, $iddocumento);
    }

    public function confirmarDocumento($iddocumento)
    {
        return $this->_model->confirmarDocumento($iddocumento);
    }

    public function anularEstadoDocumento($parametros)
    {
        return $this->_model->anularEstadoDocumento($parametros);
    }

    public function cancelarDocumento($iddocumento)
    {
        return $this->_model->cancelarDocumento($iddocumento);
    }

    public function eliminarMovimientos($arrayidmovimientos)
    {
        return $this->_model->eliminarMovimientos($arrayidmovimientos);
    }

    public function aprobarDocumento($iddocumento)
    {
        return $this->_model->aprobarDocumento($iddocumento);
    }

    public function contabilizarDocumento($iddocumento)
    {
        return $this->_model->contabilizarDocumento($iddocumento);
    }

    public function copiarDocumento($parametros)
    {
        return $this->_model->copiarDocumento($parametros);
    }

    public function cargarTipoDoc()
    {
        return $this->_model->cargarTipoDoc();
    }

    public function cargarClientes($arrayDoc)
    {
        return $this->_model->cargarClientes($arrayDoc);
    }

    public function devolverTodosUsuarios($arrayDatos)
    {
        return $this->_model->devolverTodosUsuarios($arrayDatos);
    }

    public function cargarMovLote($filtro)
    {
        return $this->_model->cargarMovLote($filtro);
    }

    public function eliminarLote($filtro, $params)
    {
        return $this->_model->eliminarLote($filtro, $params);
    }

    /**
     * Devuelve las órdenes de despacho.
     * @param array $datosDoc
     * @return array
     */
    public function devolverDocDistribucion($datosDoc = array())
    {
        return $this->_model->devolverDocDistribucion($datosDoc);
    }

    /**
     * Devuelve las solicitudes de entrega.
     * @param array $datosDoc
     * @return array
     */
    public function devolverDocSolicitudentrega($datosDoc = array())
    {
        return $this->_model->devolverDocSolicitudentrega($datosDoc);
    }

    /**
     * Devuelve los documentos de menu alimento.
     * @param array $datosDoc
     * @return array
     */
    public function devolverDocMenualimento($datosDoc = array())
    {
        return $this->_model->devolverDocMenualimento($datosDoc);
    }

    /**
     * Devuelve las órdenes de trabajo.
     * @param array $datosDoc
     * @return array
     */
    public function devolverDocOrdenTrabajo($datosDoc = array())
    {
        return $this->_model->devolverDocOrdenTrabajo($datosDoc);
    }

    /**
     * Devuelve las transferencias de la conciliacion.
     * @param array $datosDoc
     * @return array
     */
    public function devolverTransfConciliacion($datosDoc = array())
    {
        return $this->_model->devolverTransfConciliacion($datosDoc);
    }

    /**
     * Devuelve los clientes con transferencias.
     * @param array $parametros
     * @return array
     */
    public function cargarClientesConTranferecia($parametros = array())
    {
        return $this->_model->cargarClientesConTranferecia($parametros);
    }

    /**
     * Método para devolver los datos de cumplimiento de los productos del documento
     * @params array $datosDoc Arreglo con los parametros para filtrar los documentos
     * @return array
     */
    public function cargarProductosEstadoEjecucion($parametros = array())
    {
        return $this->_model->cargarProductosEstadoEjecucion($parametros);
    }

    /**
     * Método para devolver los datos de cumplimiento de los productos del documento
     * @params array $datosDoc Arreglo con los parametros para filtrar los documentos
     * @return array
     */
    public function cargarClientesBusqueda()
    {
        return $this->_model->cargarClientesBusqueda();
    }

    /**
     * Método para devolver las operaciones.
     * @return array
     */
    public function cargarOperaciones($parametros)
    {
        return $this->_model->cargarOperaciones($parametros);
    }

    public function devolverElementos($parametros)
    {
        return $this->_model->devolverElementos($parametros);
    }

}
