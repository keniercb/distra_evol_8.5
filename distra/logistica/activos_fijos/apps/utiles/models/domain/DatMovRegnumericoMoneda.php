<?php

/**
 *  Jorge Luis Cuellar Mondeja 28/10/2011
 */
class DatMovRegnumericoMoneda extends BaseDatMovRegnumericoMoneda
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomMoneda', array('local' => 'idmoneda', 'foreign' => 'idmoneda'));
        $this->hasOne('DatMovRegnumericoActivo', array('local' => 'idmovregnumerico', 'foreign' => 'idmovregnumerico'));

    }

}
