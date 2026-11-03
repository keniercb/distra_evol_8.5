<?php

/**
 * Descripción de CambioClasificacioncontableValidator
 * @author Dainier Aguila Medina
 */
class CambioClasificacioncontableValidator extends DocumentoValidator
{
    public function __construct()
    {
        parent::__construct();
    }
    
    public function initModel()
    {
        $this->model = new CambioClasificacioncontableModel(
            array('alias' => 'cambioccontableLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV, 'isPrincipal' => true)
        );
    }
    
    /**
     * Verifica si el documento contiene productos.
     * @return boolean
     * @throws ZendExt_Exception
     */
    public function validarConfirmar()
    {
        $iddocumento = implode(',', Zend_Json::decode($this->params['id']));
        if (!$this->model->contieneProductos($iddocumento)) {
            throw new ZendExt_Exception('LOG_LB_DOC_003');
        }
        return true;
    }

    /**
     * Verifica si los productos del documento cambiaron la clasificacion contable.
     * @return boolean
     * @throws ZendExt_Exception
     */
    public function validarClasificacionContable()
    {
        $iddocumento = implode(',', Zend_Json::decode($this->params['id']));
        if (!$this->model->validarClasificacionContable($iddocumento)) {
            throw new ZendExt_Exception('LOG_Comun_INV_001');
        }
        return true;
    }
}
