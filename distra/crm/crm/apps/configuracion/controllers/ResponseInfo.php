<?php

/**
 * ResponseInfo
 * 
 * @author Tte. Darien Cabrera O.
 * @package Vista.
 * @subpackage Mensaje respuesta.
 * @copyright UCID
 * @version 1.0
 */
class ResponseInfo
{

    public $success, $codigoMsg, $datos, $cantidad, $mostrar;

    public function __construct($params = array())
    {
        $this->success = isset($params["success"])? $params["success"] : true;
        $this->codigoMsg = isset($params["codigoMsg"])? $params["codigoMsg"] : 1;
        $this->mensaje = isset($params["mensaje"])? $params["mensaje"] : '';
        $this->datos = isset($params["datos"])? $params["datos"] : array();
        $this->cantidad = isset($params["cantidad"])? $params["cantidad"] : count(array());
    }

    public function getJson()
    {
        return  Zend_Json::encode(
            array(
                'success'   => $this->success,
                'codigoMsg' => $this->codigoMsg,
                'mensaje' => $this->mensaje,
                'datos'     => $this->datos,
                'cantidad'  => $this->cantidad
            )
        );
    }
}