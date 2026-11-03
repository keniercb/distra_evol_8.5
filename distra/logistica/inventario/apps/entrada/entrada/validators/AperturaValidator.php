<?php

/**
 * Descripción de AperturaValidator
 * @author Dainier Aguila Medina
 */
class AperturaValidator extends EntradasValidator
{
    public function __construct()
    {
        parent::__construct();
        $this->model = new AperturaModel(
            array('alias' => 'aperturaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV, 'isPrincipal' => true)
        );
    }

    public function validarCrearTarjeta()
    {
        return $this->model->getProductoModel()->validarExistenciaProdCantegDep($this->params);
    }

}
