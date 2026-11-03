<?php

class DatEquipoplan extends BaseDatEquipoplan {

    public function setUp() {
        parent :: setUp();
    }

    public function getByid($idequipoplan) {
        return Doctrine::getTable('DatEquipoplan')->find($idequipoplan)->toArray();
    }

}