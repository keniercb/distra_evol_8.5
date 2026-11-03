<?php

/**
 *    Jorge Luis Cuellar Mondeja 20/04/2014
 */
class DatRegnumericoTransp extends BaseDatRegnumericoTransp
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne(
            'NomTipocombustible', array('local' => 'idtipocombustible',  'foregin' => 'idtipocombustible')
        );
        $this->hasOne(
            'DatRegnumericoActivo', array('local' => 'idregnumerico', 'foreign' => 'idregnumerico')
        );
    }

}
