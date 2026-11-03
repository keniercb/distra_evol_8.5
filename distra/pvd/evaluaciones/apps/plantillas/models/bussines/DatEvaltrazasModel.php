<?php

class DatEvaltrazasModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar(DatEvaltrazas $DatEvaltrazas) {
        $DatEvaltrazas->save();
    }

    public function Actualizar(DatEvaltrazas $DatEvaltrazas) {
        try {
            $DatEvaltrazas->save();
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }

    public function getTraza($idtraza) {
        return $DatEvaltrazas = Doctrine::getTable('DatEvaltrazas')->find($idtraza);
    }    
   

}

