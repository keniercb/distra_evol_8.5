<?php
/**
 * @class InventarioValidator
 * (Descripcion de la clase, objetivo)
 *
 * @package Inventario
 * @subpackage Movimiento
 * @author Manuel Yhon Figueroa
 * @copyright XETID
 * @version 1.0
 */
class InventarioValidator extends DocumentoValidator
{
    public function __construct()
    {
        parent::__construct();
        $this->model = new InventarioModel(array('alias' => 'inventariogLog'));
    }

    /**
     * @method Metodo para confirmar si el producto tiene conteo registrado
     * @params integer $iddocumento
     * @return boolean
     */
    public function validarAprobar()
    {
        $id = implode(',', Zend_Json::decode($this->params['id']));
        return $this->model->contieneConteo($id);
    }

}
