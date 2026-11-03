<?php

class DatGenDatosContables extends BaseDatGenDatosContables {
    public function setUp() {
        parent::setUp();         
        $this->hasOne('DatRegnumerico', array('local' => 'idregnumerico', 'foreign' => 'idregnumerico'));
      
    }
}