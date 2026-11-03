<?php

/**
 * Description of DocumentoValidator
 *
 * @author Kenier Cumba Bueno
 */
class DocumentoValidator extends BaseValidator
{

    public function __construct()
    {
        parent::__construct();
    }

    public function validarConfirmar()
    {
        if (!$this->model->contieneProductos($this->params['id'])) {
            throw new ZendExt_Exception('LOG_LB_DOC_003');
        }
        return true;
    }

    public function validarConfirmarUbicacion()
    {
       
         $iddocumento = implode(',', Zend_Json::decode($this->params['id']));
         return $this->model->ubicacionConDatosCorrectos($iddocumento);
    }

    public function initModel()
    {
        $this->model = new DocumentoLogisticaModel(array('noexception' => true));
    }

}