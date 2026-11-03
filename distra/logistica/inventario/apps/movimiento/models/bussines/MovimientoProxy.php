<?php

/**
 * Description of EntradaProxy
 *
 * @author Kenier Cumba Bueno
 */
class MovimientoProxy extends MovimientosModel
{
    /**
     * Instancia del modelo especifico que se inicializa
     * en funcion del controlador que lo requiere
     * @var MovimientosModel
     */
    private $_model;

    public function __construct($datos = array())
    {
        $this->_model = $this->factoryModel($datos);
        parent::__construct($datos);
    }

    /**
     *
     * @param type $datos
     * @return MovimientosModel
     */
    public function factoryModel($datos)
    {
        switch ($datos['alias']) {
            case 'transferenciareaLog':
                return new TransferenciareaModel($datos);
            case 'ajusteLog':
                return new AjusteModel($datos);
            case 'inventariogLog':
                return new InventarioModel($datos);
            case 'transferenciainternaLog':
                return new TransferenciainternaModel($datos);
            default:
                return new MovimientosModel($datos);
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

    public function adicionarMovimientos($iddocumento, $arrIdProd, $idoperacion, $concantidad)
    {
        return $this->_model->adicionarMovimientos($iddocumento, $arrIdProd, $idoperacion, $concantidad);
    }

    public function adicionarMovLotes($datosDoc, $idarea)
    {
        return $this->_model->movimientosInvetario($datosDoc, $idarea);
    }

    public function eliminarDocumento($iddocumento)
    {
        return $this->_model->eliminarDocumento($iddocumento);
    }

    public function getSignoAjuste($tipoAjuste)
    {
        return $this->_model->getSignoAjuste($tipoAjuste);
    }

    /**
     * Elimina los movimiemientos seleccionados del documento.
     * @param array $idmovimientos
     * @param numeric $iddocumento
     * @return array
     */
    public function eliminarMovimientos($idmovimientos, $iddocumento)
    {
        return $this->_model->eliminarMovimientos($idmovimientos, $iddocumento);
    }

    public function devolverMovimientos($filtro, $dql = false)
    {
        return $this->_model->devolverMovimientos($filtro, $dql);
    }

    public function devolverDocumentos($filtro, $dql)
    {
        return $this->_model->devolverDocumentos($filtro, $dql);
    }
    
    public function confirmarDocumento($iddocumento)
    {
        return $this->_model->confirmarDocumento($iddocumento);
    }

    public function contabilizarDocumento($iddocumento)
    {
        return $this->_model->contabilizarDocumento($iddocumento);
    }

    public function anularEstadoDocumento($iddocumento)
    {
        return $this->_model->anularEstadoDocumento($iddocumento);
    }

    public function aprobarDocumento($iddocumento)
    {
        return $this->_model->aprobarDocumento($iddocumento);
    }

    public function copiarDocumento($iddocumento)
    {
        return $this->_model->copiarDocumento($iddocumento);
    }

    public function cargarAreasOrigenDestino($iddeposito)
    {
        return $this->_model->cargarAreasOrigenDestino($iddeposito);
    }

    public function cargarAreasXTipoTransferencia($idtipotransferencia, $iddeposito)
    {
        return $this->_model->cargarAreasXTipoTransferencia($idtipotransferencia, $iddeposito);
    }

    public function cargarAreas($iddeposito)
    {
        return $this->_model->cargarAreas($iddeposito);
    }

    public function cargaMotivoAjuste($asArray = false, $idoperacion = null)
    {
        return $this->_model->cargaMotivoAjuste($asArray, $idoperacion);
    }

    public function cargarNaturaleza($idarea)
    {
        return $this->_model->cargarNaturaleza($idarea);
    }

    public function cargarMesesInventariar($idestructuracomun)
    {
        return $this->_model->cargarMesesInventariar($idestructuracomun);
    }

    public function cargarAnnosInventariar()
    {
        return $this->_model->cargarAnnosInventariar();
    }

    public function obtenerUbicacionProducto($parametros)
    {
        return $this->_model->obtenerUbicacionProducto($parametros);
    }

    public function obtenerUbicacionDestino($parametros)
    {
        return $this->_model->obtenerUbicacionDestino($parametros);
    }

    public function cargarMovTransferencia($parametros)
    {
        return $this->_model->cargarMovTransferencia($parametros);
    }

    public function adicionarMovTransferencia($parametros)
    {
        return $this->_model->adicionarMovTransferencia($parametros);
    }

    public function actualizarConteo($parametros)
    {
        return $this->_model->actualizarConteo($parametros);
    }

    public function guardarConteoLote($parametros)
    {
        return $this->_model->guardarConteoLote($parametros);
    }

    public function contieneUbicacionProducto($parametros)
    {
        return $this->_model->contieneUbicacionProducto($parametros);
    }

    public function salvarCantidadTotal($parametros)
    {
        return $this->_model->salvarCantidadTotal($parametros);
    }

    public function cargarLotes($parametros)
    {
        return $this->_model->cargarLotes($parametros);
    }

    public function eliminarLote($parametros)
    {
        return $this->_model->eliminarLote($parametros);
    }

    public function cantidadMovimientos($iddocumento)
    {
        return $this->_model->cantidadMovimientos($iddocumento);
    }

    public function devolverUsuarios($campo)
    {
        return $this->_model->devolverUsuarios($campo);
    }

    public function cancelarDocumento($idDocumento)
    {
        return $this->_model->cancelarDocumento($idDocumento);
    }

    public function cargarDocumentos($uiParams)
    {
        return $this->_model->cargarDocumentos($uiParams);
    }

    public function adicionarTransferanciaInterna($uiParams)
    {
        return $this->_model->adicionarTransferanciaInterna($uiParams);
    }

    public function cargarProductosTransferanciaInterna($uiParams)
    {
        return $this->_model->cargarProductosTransferanciaInterna($uiParams);
    }

    public function guardarLote($uiParams)
    {
        return $this->_model->guardarLote($uiParams);
    }

    public function cargarCodificador($uiParams)
    {
        return $this->_model->cargarCodificador($uiParams);
    }

    public function cargarLoteAdd($uiParams)
    {
        return $this->_model->cargarLoteAdd($uiParams);
    }

    public function cargarLote($uiParams)
    {
        return $this->_model->cargarLote($uiParams);
    }

    public function eliminarProductosTransfInterna($uiParams)
    {
        return $this->_model->eliminarProductosTransfInterna($uiParams);
    }

    public function adicionarProductosTransfInterna($uiParams)
    {
        return $this->_model->adicionarProductosTransfInterna($uiParams);
    }
    
    public function getValidarConfirmar($uiParams)
    {
        return $this->_model->getValidarConfirmar($uiParams);
    }

    public function validarProductosAprobar($uiParams)
    {
        return $this->_model->validarProductosAprobar($uiParams);
    }

    public function ajustarCero($iddeposito)
    {
        return $this->_model->ajustarCero($iddeposito);
    }


}
