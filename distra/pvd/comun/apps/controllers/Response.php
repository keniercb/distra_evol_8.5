<?php

/**
 * Response
 * 
 * @author Tte. Darien Cabrera O.
 * @package Presentación.
 * @subpackage ComponentesBase.
 * @copyright UCID
 * @version 1.0
 */
/*class Response
{

    public $success, $codigoMsg, $datos, $cantidad, $mostrar;

    public function __construct($params = array())
    {
        $this->success = isset($params["success"]) ? $params["success"] : true;
        $this->codigoMsg = isset($params["codigoMsg"]) ? $params["codigoMsg"] : 1;
        $this->datos = isset($params["datos"]) ? $params["datos"] : array();
        $this->cantidad = isset($params["cantidad"]) ? $params["cantidad"] : count(array());
        $this->mostrar = true;
    }

    public function getJson()
    {

        return Zend_Json::encode(array(
            'success' => $this->success,
            'codigoMsg' => $this->codigoMsg,
            'datos' => $this->datos,
            'cantidad' => $this->cantidad
        ));
    }

    public function setMostrarResponse($value)
    {
        $this->mostrar = (boolean)$value;
    }

    public function mostrarResponse()
    {
        return $this->mostrar;
    }
}*/