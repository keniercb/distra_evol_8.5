<?php

class DatLocalObrasIng extends BaseDatLocalObrasIng{
    public function setUp() {
        parent::setUp();
        $this->hasOne('DatRegnumerico', array('local' => 'idregnumericoactivo', 'foreign' => 'idregnumerico'));
        $this->hasOne('NomLocal', array('local' => 'idlocal', 'foreign' => 'idlocal'));
        $this->hasOne('NomTipoSeccion', array('local' => 'idseccion', 'foreign' => 'idseccion'));

    }
}