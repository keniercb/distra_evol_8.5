<?php

class DatControldemandafecha extends BaseDatControldemandafecha {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatControldemanda', array('local' => 'idcontroldemanda', 'foreign' => 'idcontroldemanda'));
        $this->hasOne('NomDatosnomenclador', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador'));
        $this->hasOne('NomAprobacion', array('local' => 'idaprobacion', 'foreign' => 'idaprobacion'));
    }

}
