<?php

class CfgTipoMedioTransp extends BaseCfgTipoMedioTransp
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'CfgTipoMedio', array('local' => 'idtipomediotransp', 'foreign' => 'idtipomedio')
        );
    }

}
