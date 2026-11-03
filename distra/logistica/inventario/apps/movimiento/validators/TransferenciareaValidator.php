<?php
/**
 * @class TransferenciareaValidator
 * (Descripcion de la clase, objetivo)
 *
 * @package Inventario
 * @subpackage Movimiento
 * @author Manuel Yhon Figueroa
 * @copyright XETID
 * @version 1.0
 */
class TransferenciareaValidator extends DocumentoValidator
{
    public function __construct()
    {
        parent::__construct();
        $this->model = new TransferenciareaModel(array('alias' => 'transferenciaLog'));
    }

    public function validarCantidad()
    {
        if (!$this->model->contieneCantidad($this->params['id'])) {
            return false;
        }
        return true;
    }
    
    /**
     * Verifica que todos los conteos fisico (ajuste de inventario) esten contabilizados.
     * @return boolean
     */
    public function validarConteoFisico()
    {
        $iddocumento = implode(',', Zend_Json::decode($this->params['id']));
        return $this->model->conteoFisico($iddocumento);
    }
}