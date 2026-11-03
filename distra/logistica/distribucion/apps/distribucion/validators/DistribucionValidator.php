<?php

/**
 * @class DistribucionValidator
 * (Descripcion de la clase, objetivo)
 *
 * @package Distribucion
 * @subpackage Distribucion
 * @author Manuel Yhon Figueroa
 * @copyright XETID
 * @version 1.0
 */
class DistribucionValidator extends DocumentoValidator
{

    public function __construct()
    {
        parent::__construct();
        $this->model = new DistribucionModel(
            array('alias' => 'entregaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_DIST)
        );
    }


    /**
     * Verifica que el producto tenga producto.
     *
     * @return bool
     */
    public function validarConfirmar()
    {
        return $this->model->contieneProductos($this->params['id']);
    }

    /**
     * @method Metodo para confirmar si el producto tiene cantidad registrada
     * @params Integer $iddocumento
     * @return boolean
     */
    public function validarCantidad()
    {
        if (!$this->model->contieneCantidad($this->params['id'])) {
            return false;
        }
        return true;
    }

    /**
     * @method Metodo para confirmar si el cliente tiene pedidos
     * @params Integer $iddocumento
     * @return boolean
     */
    public function validarPedidos()
    {
        if ($this->model->adicionarDestinos($this->params['iddocumento'], $this->uiParams['idcliente'])) {
            
        }
    }

}
