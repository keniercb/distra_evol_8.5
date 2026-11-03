<?php

class NomMarcaarmamento extends BaseNomMarcaarmamento
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatMarcaarmamentoEntidad', array('local' => 'idmarcaarmamento', 'foreign' => 'idmarcaarmamento')
        );
        $this->hasOne('NomElemento', array('local' => 'idelemento', 'foreign' => 'idelemento'));
        $this->hasMany('DatMovproductomunic', array('local' => 'idmarcaarmamento', 'foreign' => 'idmarcapolvuno'));
    }

}


