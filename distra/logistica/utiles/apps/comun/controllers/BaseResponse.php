<?php

/**
 * Clase que reprensenta una respuesta generica de las peticiones \
 * de la vista al ser
 *
 * @author Kenier
 */
class BaseResponse
{

    protected $cantidad,
        $datos,
        $success,
        $codigoMsg,
        $map,
        $autoShow;

    public function __construct()
    {
        $this->cantidad = 0;        
        $this->datos = array();
        $this->success = true;
        $this->codigoMsg = 1;
        $this->autoShow = true;
        $this->map = array();
    }

    public function toJsonResponse()
    {
        $respuesta = array_merge(
            array(
                'cantidad'  => $this->cantidad,
                'total'  => $this->cantidad,
                'datos'     => $this->datos,
                'success'   => $this->success,
                'codigoMsg' => $this->codigoMsg,
            ), $this->map
        );
        if ($this->autoShow == true) {
            echo Zend_Json::encode($respuesta);
        }
    }

    public function __set($key, $value)
    {
        if (isset($this->$key)) {
            $this->$key = $value;            
        } else {
            $this->map[$key] = $value;
        }
    }

    public function __get($key)
    {
        if (isset($this->$key)) {
            return $this->$key;
        }
    }
}
