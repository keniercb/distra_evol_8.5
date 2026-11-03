<?php

class DatFormulaactividad extends BaseDatFormulaactividad {

    public function setUp() {
        parent::setUp();
        $this->hasMany(
                'NomActividad', array('local' => 'idactividad', 'foreign' => 'idactividad')
        );
        $this->hasMany(
                'DatFormula', array('local' => 'idformula', 'foreign' => 'idformula')
        );
    }

}
