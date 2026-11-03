<?php

/**
 * Description of SolicitudEntregaValidator
 *
 * @author Osmel A. Larduet Hechavarría
 */
class DocumentoSalidaValidator extends SalidaValidator
{
    public function __construct()
    {
        parent::__construct();
        $this->model = new DocumentosalidaModel(array('alias' => 'valeLog'));
    }

    /**
     * Verifica que los productos con lote del documento tengan cantidades registradas.
     * @return boolean
     */
    public function validarCantidadLotes()
    {
        $iddocumento = implode(',', Zend_Json::decode($this->params['id']));
        return $this->model->lotesConCantidad($iddocumento);
    }
    
    public function validarNroSerie()
    {
        $iddocumento = implode(',', Zend_Json::decode($this->params['id']));
        return $this->model->tieneNroSerie($iddocumento);
    }
    
    public function validarTransportador()
    {
        $iddocumento = implode(',', Zend_Json::decode($this->params['id']));
        return $this->model->tieneTransportador($iddocumento);
    }
    
    public function validarCuenta()
    {
        return true;
        $iddocumento = implode(',', Zend_Json::decode($this->params['id']));
        return $this->model->tieneCuenta($iddocumento);
    }
    
    public function validarElementoGasto()
    {
        return true;
        $iddocumento = implode(',', Zend_Json::decode($this->params['id']));
        return $this->model->tieneElementoGasto($iddocumento);
    }
    
    /**
     * Verifica que todos los conteos fisico (ajuste de inventario) esten contabilizados.
     * @return boolean
     */
    public function validarConteoFisico()
    {
		return true;/*
        $iddocumento = implode(',', Zend_Json::decode($this->params['id']));
        return $this->model->conteoFisico($iddocumento);*/
    }

}
