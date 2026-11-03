<?php
/**
 * @class AjusteValidator
 * (Descripcion de la clase, objetivo)
 *
 * @package Inventario
 * @subpackage Movimiento
 * @author Manuel Yhon Figueroa
 * @copyright XETID
 * @version 1.0
 */
class AjusteValidator extends DocumentoValidator
{
    public function __construct()
    {
        parent::__construct();
        $this->model = new AjusteModel(array('alias' => 'ajusteLog'));
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
     * Función para confirmar si los equipos tienen el número de serie registrado.
     * @params Integer $iddocumento
     * @return boolean
     */
    public function validarNroSerie()
    {
        $iddocumento = implode(',', Zend_Json::decode($this->params['id']));
        if (!$this->model->contieneNroSerie($iddocumento)) {
            return false;
        }
        return true;
    }
    
    public function validarDiferencia()
    {
        $iddocumento = implode(',', Zend_Json::decode($this->params['id']));
        if ($this->model->tieneDiferencias($iddocumento)) {
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