<?php

class NomOcupacionViv extends BaseNomOcupacionViv
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatOcupacionVivEntidad', array('local' => 'idocupacionviv', 'foreign' => 'idocupacionviv'));

    }

}
