<?php

class DatDesempenno extends BaseDatDesempenno {

    public function setUp() {
        parent :: setUp();
    }

    public function getByid($iddatdesempenno) {
        return Doctrine::getTable('DatDesempenno')->find($iddatdesempenno)->toArray();
    }

}

