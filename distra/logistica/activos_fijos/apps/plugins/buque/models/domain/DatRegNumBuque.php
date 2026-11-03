<?php

/**
 *    Jorge Luis Cuellar Mondeja 20/04/2014
 */
class DatRegNumBuque extends BaseDatRegNumBuque
{

    public function setUp()
    {
        parent:: setUp();
        /*$this->hasOne(
            'NomTipocombustible', array('local' => 'idtipocombustible',  'foregin' => 'idtipocombustible')
        );*/
        $this->hasOne('DatRegnumericoActivo', array('local' => 'idregnumerico', 'foreign' => 'idregnumbuque'));
        $this->hasOne('NomBandera', array('local' => 'idbandera', 'foreign' => 'idbandera'));
        $this->hasOne('NomCasaClasificadora', array('local' => 'idcasaclasifc', 'foreign' => 'idcasaclasifc'));


    }

}
