<?php

class DatPartesPiezasAgregados extends BaseDatPartesPiezasAgregados
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
    }

}
