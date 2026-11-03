<?php

class DatDatosContables extends BaseDatosContables {
    public function setUp() {
        parent::setUp();         
        $this->hasOne('DatRegnumerico', array('local' => 'idregnumericoactivo', 'foreign' => 'idregnumerico'));
      
    }
}