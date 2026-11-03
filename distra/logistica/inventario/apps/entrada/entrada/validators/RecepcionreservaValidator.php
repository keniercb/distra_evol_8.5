<?php

/**
 * Descripción de RecepcionreservaValidator
 * @author Dainier Aguila Medina
 */
class RecepcionreservaValidator extends RecepcionValidator
{
    public function __construct()
    {
        parent::__construct();
        $this->model = new RecepcionreservaModel(array('alias' => 'recepcionLog', 'reserva' => true));
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

}
