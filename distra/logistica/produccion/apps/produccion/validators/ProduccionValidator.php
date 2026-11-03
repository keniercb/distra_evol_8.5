<?php

/**
 * Descripción de ProduccionValidator
 *
 * @author Manuel Yhon Figueroa
 */
class ProduccionValidator extends DocumentoValidator
{
    public function __construct()
    {
        parent::__construct();
        $this->model = new OrdenProduccionModel(
            array('subsistema' => LogisticaGlobal::SUBSISTEMA_PRODUCCION)
        );
    }

    public function validarAnularDocumento()
    {
        $iddocumento = Zend_Json::decode($this->params['id']);
        return $this->model->validarDocGeneradoRecepcion($iddocumento);
    }
    public function validarEliminar()
    {
        $iddocumento = Zend_Json::decode($this->params['id']);
        return $this->model->validarEliminarVale($iddocumento);
    }
}