<?php

/**
 * Description of EntradaProxy
 *
 * @author Kenier Cumba Bueno
 */
class EntradaProxy extends EntradaModel
{
    /**
     * Instancia del modelo especifico que se inicializa en funcion del
     * controlador que lo requiere
     * @var EntradaModel
     */
    private $_model;

    public function __construct($datos = array())
    {
        $this->_model = $this->factoryModel($datos);
        parent::__construct($datos);
    }

    /**
     * @param $datos
     * @author Kenier Cumba Bueno
     * @return object
     */
    public function factoryModel($datos)
    {
        switch ($datos['alias']) {
            case 'aperturaLog':
                return new AperturaModel($datos);
            case 'recepcionLog':
                if ($datos['reserva']) {
                    return new RecepcionreservaModel($datos);
                }
                return new RecepcionModel($datos);
            case 'valedev':
                return new DevolucionModel($datos);
            case 'informediferenciaLog':
                return new ReclamacionModel($datos);
            default:
                return new EntradaModel($datos);
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

    /**
     * @return array
     */
    public function cargaInicial()
    {
        return $this->_model->cargaInicial();
    }

    /**
     * Adiciona un documento.
     *
     * @param array $datosDoc Arreglo de datos del documento con sus preductos.
     * @author Kenier Cumba Bueno
     * @return type iddocumento
     */
    public function adicionarDocumento($datosDoc = array())
    {
        return $this->_model->adicionarDocumento($datosDoc);
    }

    /**
     * Devuelve los documentos dado los criterios de búsqueda especificados.
     * @param array $datosDoc Arreglo de datos del documento con sus preductos.
     * @param boolean $dql Determina si se devuelve la consulta.
     * @author Kenier Cumba Bueno
     * @return array
     */
    public function devolverDocumentos($parametros, $dql)
    {
        return $this->_model->devolverDocumentos($parametros, $dql);
    }

    /**
     * Aprueba el documento cambiandole el estado.
     * @param numeric $iddocumento Indentificador del documento.
     * @param boolean $setCronologia.
     * @return boolean
     */
    public function aprobarDocumento($iddocumento, $setCronologia = true)
    {
        return $this->_model->aprobarDocumento($iddocumento, $setCronologia);
    }

    /**
     * Duplica el documento seleccionado.
     * @param numeric $iddocumento Indentificador del documento.
     * @return numeric
     */
    public function copiarDocumento($iddocumento)
    {
        return $this->_model->copiarDocumento($iddocumento);
    }

    /**
     * Confirma un documento seleccionado.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function contarDocumento($iddocumento)
    {
        return $this->_model->contarDocumento($iddocumento);
    }

    /**
     * Confirma un documento seleccionado.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function confirmarDocumento($iddocumento)
    {
        return $this->_model->confirmarDocumento($iddocumento);
    }

    /**
     * @param numeric $iddocumento
     * @param boolean $porfactura
     * @return boolean
     */
    public function anularEstadoDocumento($iddocumento, $porfactura)
    {
        return $this->_model->anularEstadoDocumento($iddocumento, $porfactura);
    }

    /**
     * Contabiliza un documento seleccionado.
     * @param numeric $iddocumento.
     * @return boolean
     */
    public function contabilizarDocumento($iddocumento)
    {
        return $this->_model->contabilizarDocumento($iddocumento);
    }

    /**
     * Elimina un documento seleccionado.
     * @param numeric $iddocumento Indentificador del documento.
     * @return boolean
     */
    public function eliminarDocumento($iddocumento)
    {
        return $this->_model->eliminarDocumento($iddocumento);
    }

    public function cancelarDocumento($iddocumento)
    {
        return $this->_model->cancelarDocumento($iddocumento);
    }

    /**
     * Devuelve los movimientos del documento.
     * @param array $filtro
     * @return array
     */
    public function devolverMovimientos($filtro)
    {
        return $this->_model->devolverMovimientos($filtro);
    }

    public function adicionarMovimientos($iddocumento, $idproductos)
    {
        return $this->_model->adicionarMovimientos($iddocumento, $idproductos);
    }

    public function eliminarMovimientos($arrIdMov, $iddocumento)
    {
        return $this->_model->eliminarMovimientos($arrIdMov, $iddocumento);
    }

    public function cargarComboTipoDocumento()
    {
        return $this->_model->cargarComboTipoDocumento();
    }

    /**
     * Genera un vale de devolución a partir de un vale de entrega o una factura.
     * @param array $datos
     * @return integer
     */
    public function generarDocumento($datos)
    {
        return $this->_model->generarDocumento($datos);
    }

    /**
     * Busca el padre del documento.
     * @param numeric $iddocumento
     * @return array
     */
    public function buscarPadre($iddocumento)
    {
        return $this->_model->buscarPadre($iddocumento);
    }

    /**
     * Establece la cantidad mínima para los movimientos.
     * @param integer $iddocumento
     */
    public function cantidadMinimaProd($iddocumento)
    {
        $this->_model->cantidadMinimaProd($iddocumento);
    }

    /**
     * Devuelve los documentos contabilizados de un subsistema.
     * @param array $filtro Contiene "idcliente", "estado" y opcionalmente "conduce = true".
     * @return array
     */
    public function cargarDocumentosExternos($filtro)
    {
        return $this->_model->cargarDocumentosExternos($filtro);
    }

    /**
     * Devuelve los productos de un documento del subsistema especificado.
     * @param array $filtro
     * @return array
     */
    public function cargarProductosDocumentoExterno($filtro)
    {
        return $this->_model->cargarProductosDocumentoExterno($filtro);
    }

    /**
     * Devuelve los vales de entrega.
     * @param array $filto
     * @return array
     */
    public function cargarDocSalida($filto)
    {
        return $this->_model->cargarDocSalida($filto);
    }

    /**
     * Devuelve las facturas.
     * @param array $filtro
     * @return array
     */
    public function cargarDocFactura($filtro)
    {
        return $this->_model->cargarDocFactura($filtro);
    }

    /**
     * @param array $filtro
     * @return array
     */
    public function cargarDiferenciasXCantidad($filtro)
    {
        return $this->_model->cargarDiferenciasXCantidad($filtro);
    }

    /**
     * @param numeric $idmovimiento
     * @return array
     */
    public function cargarDiferenciasXCalidad($idmovimiento)
    {
        return $this->_model->cargarDiferenciasXCalidad($idmovimiento);
    }

    /**
     * @param array $datosDoc
     * @return boolean
     */
    public function registrarDiferencias($datosDoc)
    {
        return $this->_model->registrarDiferencias($datosDoc);
    }

    /**
     * Devuelve un arreglo con los lotes del producto.
     * @param array $filtro
     * @return array
     */
    public function cargarLotes($filtro)
    {
        return $this->_model->cargarLotes($filtro);
    }

    /**
     * Devuelve un arreglo con los lotes y los movlotes del producto.
     * @param array $filtro
     * @return array
     */
    public function cargarMovLote($filtro)
    {
        return $this->_model->cargarMovLote($filtro);
    }

    /**
     * Devuelve los depósitos de almacenamiento de la entidad autenticada.
     * @return array
     */
    public function cargarDepositos()
    {
        return $this->_model->cargarDepositos();
    }

    /**
     * Devuelve los tipos de monedas por entidad.
     * @return array
     */
    public function cargarTipoMonedas()
    {
        return $this->_model->cargarTipoMonedas();
    }

    /**
     * Devuelve las monedas del movimiento.
     * @param array $filtro
     * @return array
     */
    public function cargarMonedas($filtro, $dql = false)
    {
        return $this->_model->cargarMonedas($filtro, $dql);
    }

    /**
     * Elimina las monedas del movimiento.
     * @param array $idmovmonedas
     * @return boolean
     */
    public function eliminarMoneda($idmovmonedas)
    {
        return $this->_model->eliminarMoneda($idmovmonedas);
    }

    /**
     * Actualiza el cumplimiento de devolución de los productos del documento.
     * @param numeric $iddocumento
     * @param boolean $borrar [Opcional]
     * @param array $idmovimientos [Opcional]
     * @return boolean
     */
    public function actualizarProductoCmplto($iddocumento, $borrar = false, $idmovimientos = array())
    {
        return $this->_model->actualizarProductoCmplto($iddocumento, $borrar, $idmovimientos);
    }
    
    public function getCantMovimientos($iddocumento)
    {
        return $this->_model->getCantMovimientos($iddocumento);
    }
    
    public function getImporteMovimientos($iddocumento)
    {
        return $this->_model->getImporteMovimientos($iddocumento);
    }
    
    public function cargarDocumentosReserva($filtro)
    {
        return $this->_model->cargarDocumentosReserva($filtro);
    }
    
    public function cargarProductosReserva($filtro)
    {
        return $this->_model->cargarProductosReserva($filtro);
    }
    
    public function cargarProductosCuadroBasico($filtro)
    {
        return $this->_model->cargarProductosCuadroBasico($filtro);
    }
    
    public function importarFichero($datos, $params)
    {
        return $this->_model->importarFichero($datos, $params);
    }
    
    public function sincronizarObjeto($datos, $params)
    {
        return $this->_model->sincronizarObjeto($datos, $params);
    }
    
    public function cargarProductoError($filtro)
    {
        return $this->_model->cargarProductoError($filtro);
    }
    
    public function eliminarImportar($iddocumento)
    {
        return $this->_model->eliminarImportar($iddocumento);
    }

    public function cargarMonedasDiferentes(){
        return $this->_model->cargarMonedasDiferentes();
    }

    public function obtenerCondicionesPago($params){
        return $this->_model->obtenerCondicionesPago($params);
    }
    
    public function cargarConceptosImporte($params) {
        return $this->_model->cargarConceptosImporte($params);
    }

    public function cargarProductos711($params) {
        return $this->_model->cargarProductos711($params);
    }

    public function getContratos($params) {
        return $this->_model->getContratos($params);
    }
    
    public function getServContrato($params) {
        return $this->_model->getServContrato($params);
    }

    public function getProdContrato($params) {
        return $this->_model->getProdContrato($params);
    }

    public function getPuertos($params) {
        return $this->_model->getPuertos($params);
    }

    public function generarCodigoBarrasProductoError($params) {
        return $this->_model->generarCodigoBarrasProductoError($params);
    }

}
