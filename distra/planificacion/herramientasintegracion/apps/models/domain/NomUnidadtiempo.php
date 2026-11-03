<?php

class NomUnidadtiempo extends BaseNomUnidadtiempo {

    public function setUp() {
        parent :: setUp();
        $this->hasMany('DatTareagantt', array('local' => 'idunidadtiempo', 'foreign' => 'idunidadtiempo'));
    }

    public function getByid($idunidadtiempo) {
        return Doctrine::getTable('NomUnidadtiempo')->find($idunidadtiempo)->toArray();
    }
    
    public function obtenerUnidadTiempo() {
        $query = Doctrine_Query::create();
        $query->select('ut.idunidadtiempo, ut.denominacion');
        $query->from('NomUnidadtiempo ut');        
        return $query->execute()->toArray(); 
    }

}
