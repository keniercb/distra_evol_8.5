<?php

/**
 *  Jorge Luis Cuellar Mondeja 06/11/2015
 */
class HisRegNumericoEstatus extends BaseHisRegNumericoEstatus
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatRegnumerico', array('local' => 'idregnumerico', 'foreign' => 'idregnumerico'));
        $this->hasOne('NomEstatustecnico', array('local' => 'idestatustecnico', 'foreign' => 'idestatustecnico'));
    }

}
