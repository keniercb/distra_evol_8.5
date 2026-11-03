<?php

class DatFormulatablacalorica extends BaseDatFormulatablacalorica {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'DatTablacalorica', array('local' => 'idtablacalorica', 'foreign' => 'idtablacalorica')
        );
        $this->hasOne(
                'DatFormula', array('local' => 'idformula', 'foreign' => 'idformula')
        );
    }

}
