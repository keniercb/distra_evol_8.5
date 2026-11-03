<?php

/**
 * Descripción de DevolucionValidator
 *
 * @author Dainier Aguila Medina
 */
class DevolucionValidator extends EntradasValidator
{
    public function __construct()
    {
        parent::__construct();
        $this->model = new DevolucionModel(array('alias' => 'valedev'));
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

    public function validarConfirmar(){
        return true;
    }

}
