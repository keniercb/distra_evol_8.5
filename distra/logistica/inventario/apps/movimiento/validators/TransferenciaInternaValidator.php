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
class TransferenciaInternaValidator extends DocumentoValidator
{
    public function __construct()
    {
        parent::__construct();
        $this->model = new TransferenciainternaModel(array('alias' => 'transferenciainternaLog'));
    }

    public function validarConfirmarUbicacion()
    {
        $iddocumento = implode(',', Zend_Json::decode($this->params['id']));
        return $this->model->ubicacionConDatosCorrectos($iddocumento);
    }
}