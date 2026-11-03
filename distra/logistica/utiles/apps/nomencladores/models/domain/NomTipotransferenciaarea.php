<?php

class NomTipotransferenciaarea extends BaseNomTipotransferenciaarea
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomTipotransferencia',
            array('local'   => 'idtipotransferencia',
                  'foreign' => 'idtipotransferencia')
        );
        $this->hasOne(
            'NomTipoarea',
            array('local' => 'idnomtipoarea', 'foreign' => 'idnomtipoarea')
        );
    }

}
