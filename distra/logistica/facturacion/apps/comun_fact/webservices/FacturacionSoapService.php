<?php

class FacturacionSoapService
{

    private $_modelFactura;

    function __construct(){
        $this->_modelFactura = new FacturaSoapModel();
    }

    function adicionarFactura($parametros){
        try{
            $parametros['connection'] = Doctrine_Manager::getInstance()->getCurrentConnection()->getName();
            $respuesta = $this->_modelFactura->adicionarFactura($parametros);
            return json_encode(array('success'=>true, 'msg'=>$respuesta));
        }catch (Exception $e){
            return json_encode(array('code'=>$e->getCode(), 'msg'=>$e->getMessage(), 'success'=>false));
        }

    }

    function adicionarFacturas($parametros){
        try{
            $parametros['connection'] = Doctrine_Manager::getInstance()->getCurrentConnection()->getName();
            $respuesta = $this->_modelFactura->adicionarFacturas($parametros);
            return json_encode(array('success'=>true, 'msg'=>$respuesta));
        }catch (Exception $e){
            return json_encode(array('code'=>$e->getCode(), 'msg'=>$e->getMessage(), 'success'=>false));
        }
    }
}