<?php

class NomTipoComunicacion extends BaseNomTipoComunicacion {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatTipoComunicacionEntidad', array('local' => 'idcomunicacion', 'foreign' => 'idcomunicacion'));
    }

   

}
