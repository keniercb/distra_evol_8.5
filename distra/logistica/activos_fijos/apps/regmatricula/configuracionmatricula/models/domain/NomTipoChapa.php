<?php

class NomTipoChapa extends BaseNomTipoChapa
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatTipoChapaEntidad', array('local' => 'idtipochapa', 'foreign' => 'idtipochapa'));
    }

}
