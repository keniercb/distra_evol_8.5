<?php

class DatAccion2 extends BaseDatAccion2 {

    public function setUp() {
        parent :: setUp();
    }

    public function getByid($idmedio) {
        return Doctrine::getTable('DatAccion2')->find($idmedio)->toArray();
    }

}

