<?php

/**
 * @class ReenvaseValidator
 * (Descripcion de la clase, objetivo)
 *
 * @package Farmacia
 * @subpackage Farmacia
 * @author Manuel Yhon Figueroa
 * @copyright XETID
 * @version 1.0
 */
class ReenvaseValidator extends DocumentoValidator
{

    public function __construct()
    {
        parent::__construct();
        $this->model = new ReenvaseModel(
            array('alias' => 'reenvaseLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_FARMACIA)
        );
    }


    /**
     * Verifica que el reenvase tenga producto destino.
     *
     * @return bool
     */
    public function validarConfirmarOrigen()
    {
        return $this->model->contieneProductosOrigen($this->params['id']);
    }

    public function validarConfirmarDestino()
    {
        return $this->model->contieneProductosDestino($this->params['id']);
    }

    /**
     * @method Metodo para confirmar si el producto origen tiene cantidad registrada
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
     * @method Metodo para confirmar si se ha reenvasado el producto
     * @params Integer $iddocumento
     * @return boolean
     */
    public function validarPedidos()
    {
        if ($this->model->adicionarDestinos($this->params['iddocumento'], $this->uiParams['idcliente'])) {
        }
    }
}