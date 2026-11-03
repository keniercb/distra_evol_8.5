<?php

class DatCaractTecnicaCamp extends BaseDatCaractTecnicaCamp {
    public function setUp() {
        parent::setUp();
        $this->hasOne('NomTipoConstruccion', array('local' => 'idtipocontruccion', 'foreign' => 'idtipoconstruccion'));
        $this->hasOne('NomEstatustecnico', array('local' => 'idestatustecnico', 'foreign' => 'idestatustecnico'));
        $this->hasOne('DatRegnumerico', array('local' => 'idregnumericoactivo', 'foreign' => 'idregnumerico'));
        $this->hasMany('DatMatConsInmuCamp', array('local' => 'idcaracteristicainmcamp', 'foreign' => 'idcaracteristicainmcamp'));
    }
}