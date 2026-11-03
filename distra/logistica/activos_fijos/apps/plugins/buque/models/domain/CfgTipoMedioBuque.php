<?php

class CfgTipoMedioBuque extends BaseCfgTipoMedioBuque
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'CfgTipoMedio', array('local' => 'idtipomediobuque', 'foreign' => 'idtipomedio')
        );
    }

}
