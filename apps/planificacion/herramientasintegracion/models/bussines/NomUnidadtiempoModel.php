<?php

class NomUnidadtiempoModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }
    
    public function obtenerUnidadTiempo() {
        $objNomUnidadtiempo = new NomUnidadtiempo();
        $data = $objNomUnidadtiempo->obtenerUnidadTiempo();        
        return $data;
    }

}
