<?php

class DatGestpersonadel711Model extends ZendExt_Model {
    
    public function setUp() {
        parent::ZendExt_Model();
    }
    
    public function listarPersonas711($params){
        $result = DatGestpersonadel711::listarPersonas711($params);
        return $result;
    }

}