<?php

class DatProducto711Model extends ZendExt_Model {
    
    public function setUp() {
        parent::ZendExt_Model();
    }
    
    public function listarProductos711($params){
        $result = DatProducto711::listarProductos711($params);
        return $result;
    }
    public function ExisteProductos711($params){
        $result = DatProducto711::ExisteProductos711($params);
        return $result;
    }
    
    public function adicionarModificarProductos($paramestros){
        if($paramestros['accion']==1){
            if($paramestros['tipo']==0){
                $result = DatProducto711::AdicionarProductos($paramestros);
            }
            if($paramestros['tipo']==1){
                $result = DatProducto711::AdicionarIndicador($paramestros);
            }
            if($paramestros['tipo']==2){
                $result = DatProducto711::AdicionarTarea($paramestros);
            }
        }
        if($paramestros['accion']==2){
            if($paramestros['tipo']==0){
                $result = DatProducto711::ModificarProductos($paramestros);
            }else{
                $result = DatProducto711::ModificarIndicador($paramestros);
            }
        }        
        return $result;
    }
    
    public function EliminarProductos($params){
        if($params['idproducto711']=='aprobar'){
            $result = DatProducto711::AprobarEnMaestro1();
            $result = DatProducto711::AprobarEnMaestro2();
        }else{
            $result = DatProducto711::EliminarProductos($params);
        }
        return $result;
    }
}