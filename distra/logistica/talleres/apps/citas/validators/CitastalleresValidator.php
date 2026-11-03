<?php

/**
 * Descripción de AperturaValidator
 *
 * @author Dainier Aguila Medina
 */
class CitastalleresValidator extends DocumentoValidator
{
    public function __construct()
    {
        parent::__construct();
        $this->model = new CitasTalleresModel(array('alias' => 'citasLOG'));
    }

    public function validarAnularEstado()
    {
        $iddocumento = Zend_Json::decode($this->params['id']);
        $ignorar = $this->params['rectificar'];
        return $this->model->validarExistenciaDocGenerado($iddocumento, $ignorar);
    }
}
