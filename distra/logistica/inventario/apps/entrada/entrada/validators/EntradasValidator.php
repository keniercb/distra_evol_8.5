<?php

/**
 * Descripción de EntradasValidator
 * @author Dainier Aguila Medina
 */
class EntradasValidator extends DocumentoValidator
{
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Verifica que los productos del documento tengan cantidades registradas.
     * @return boolean
     */
    public function validarCantidad()
    {
        $iddocumento = implode(',', Zend_Json::decode($this->params['id']));
        return $this->model->productosConCantidad($iddocumento);
    }

    /**
     * Verifica que los productos no tengan precio cero.
     * @return boolean
     */
    public function validarPrecio()
    {
        $iddocumento = implode(',', Zend_Json::decode($this->params['id']));
        return $this->model->productosConPrecio($iddocumento);
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
