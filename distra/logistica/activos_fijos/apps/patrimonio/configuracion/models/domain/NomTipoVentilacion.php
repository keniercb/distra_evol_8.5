<?php

class NomTipoVentilacion extends BaseNomTipoVentilacion {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatTipoVentilacionEntidad', array('local' => 'idventilacion', 'foreign' => 'idventilacion'));
    }

   

}
