<?php

/**
 * Descripción de RecepcionValidator
 * @author Dainier Aguila Medina
 */
class RecepcionValidator extends EntradasValidator
{
    public function __construct()
    {
        parent::__construct();
        $this->model = new RecepcionModel(array('alias' => 'recepcionLog'));
    }

    /**
     * Verifica que los productos del documento tengan cantidades registradas.
     * @return boolean
     */
    public function validarCantidad()
    {
        $iddocumento = implode(',', Zend_Json::decode($this->params['id']));
        return $this->model->productosConCantidad($iddocumento, $this->params['porfactura']);
    }

    /**
     * Verifica que los productos del documento tengan cantidades registradas.
     * @return boolean
     */
    public function validarDescuento()
    {
        $iddocumento = implode(',', Zend_Json::decode($this->params['id']));
        return $this->model->productosConDescuento($iddocumento);
    }

    public function validarConfirmar(){
        return true;
    }
}
