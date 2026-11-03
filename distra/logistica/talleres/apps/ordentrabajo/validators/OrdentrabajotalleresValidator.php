<?php

/**
 * Descripción de AperturaValidator
 *
 * @author Dainier Aguila Medina
 */
class OrdentrabajotalleresValidator extends DocumentoValidator
{
    public function __construct()
    {
        parent::__construct();
        $this->model = new OrdenTrabajoTalleresModel(array('alias' => 'ordenServicioLOG'));
    }

    public function validarAnularEstado()
    {
        $iddocumento = Zend_Json::decode($this->params['id']);
        $ignorar = $this->params['rectificar'];
        return $this->model->validarExistenciaDocGenerado($iddocumento, $ignorar);
    }

    public function validarCerrarOrdenTrabajo()
    {
        $iddocumento = Zend_Json::decode($this->params['id']);
        return $this->model->validarCerrarOrdenTrabajoProducto($iddocumento);
    }
}
