<?php

class NomSistemaEnergetico extends BaseNomSistemaEnergetico {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatSistemaEnergeticoEntidad', array('local' => 'idenergetico', 'foreign' => 'idenergetico'));
    }

   

}
