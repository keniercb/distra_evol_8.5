<?php

/**
 * Descripción de ReclamacionValidator
 *
 * @author Dainier Aguila Medina
 */
class ReclamacionValidator extends EntradasValidator
{
    public function __construct()
    {
        parent::__construct();
        $this->model = new ReclamacionModel(array('alias' => 'informediferenciaLog'));
    }

}
