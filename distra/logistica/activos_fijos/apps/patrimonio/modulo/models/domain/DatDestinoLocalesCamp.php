<?php

class DatDestinoLocalesCamp extends BaseDatDestinoLocalesCamp {
    public function setUp() {
        parent::setUp();
        $this->hasOne('NomLocal', array('local' => 'idlocal', 'foreign' => 'idlocal'));      
        $this->hasOne('DatRegnumerico', array('local' => 'idregnumericoactivo', 'foreign' => 'idregnumerico'));
      
    }
}