<?php

class DatInscripcionInmueble extends BaseDatInscripcionInmueble {
    public function setUp() {
        parent::setUp();
        $this->hasOne('NomTipoSeccion', array('local' => 'idseccion', 'foreign' => 'idseccion'));
        $this->hasOne('DatRegnumericoActivo', array('local' => 'idregnumerico', 'foreign' => 'idregnunericoactivo'));
    }
}