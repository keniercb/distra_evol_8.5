<?php

class DatIdentificacionInmuebleCamp extends BaseIdentificacionInmuebleCamp {
    public function setUp() {
        parent::setUp();
        $this->hasOne('DatRegnumerico', array('local' => 'idindentificacioninmueble', 'foreign' => 'idregnumerico'));

    }
}