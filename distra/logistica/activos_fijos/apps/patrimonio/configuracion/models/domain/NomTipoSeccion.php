<?php

class NomTipoSeccion extends BaseNomTipoSeccion{

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatTipoSeccionEntidad', array('local' => 'idseccion', 'foreign' => 'idseccion'));
    }

   

}
