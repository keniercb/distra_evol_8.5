<?php

class NomCumplimientoinversion extends BaseDatInversion {

    public function setUp() {
        parent :: setUp();
    }

    private function addWhereConParams(&$Where, &$params_query, $colum_cond, $param) {
        $Where.= " AND " . $colum_cond . $param;
    }

}
