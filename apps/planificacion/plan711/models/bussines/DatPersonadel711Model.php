<?php

class DatPersonadel711Model extends ZendExt_Model {
    
    public function setUp() {
        parent::ZendExt_Model();
    }
    
    public function listarPersonas711($params){
        $result = DatPersonadel711::listarPersonas711($params);
        return $result;
    }
    public function adicionarModificarPersona($paramestros){
        if($paramestros['accion']==1){
            $result = DatPersonadel711::AdicionarPersona($paramestros);
        }
        if($paramestros['accion']==2){
            $result = DatPersonadel711::ModificarPersona($paramestros);
        }        
        return $result;
    }
    public function EliminarPersona($params){
        $result = DatPersonadel711::EliminarPersona($params);
        return $result;
    }
    public function InhabilitarPersona($params){
        $result = DatPersonadel711::InhabilitarPersona($params);
        return $result;
    }
    public function HabilitarPersona($params){
        $result = DatPersonadel711::HabilitarPersona($params);
        return $result;
    }

}