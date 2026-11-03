<?php

class DatMarcaarmamentoEntidad extends BaseDatMarcaarmamentoEntidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomMarcaarmamento', array('local' => 'idmarcaarmamento', 'foreign' => 'idmarcaarmamento'));
    }

}


