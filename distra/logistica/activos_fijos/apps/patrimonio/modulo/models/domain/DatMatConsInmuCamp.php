<?php

class DatMatConsInmuCamp extends BaseDatMatConsInmuCamp {
    public function setUp() {
        parent::setUp();
        $this->hasMany('NomMaterialConstruccion', array('local' => 'idmaterialconstruccion', 'foreign' => 'idmaterialesconstruccion'));
        $this->hasMany('DatCaractTecnicaCamp', array('local' => 'idcaracteristicainmcamp', 'foreign' => 'idcaracteristicainmcamp'));
       
    }
}