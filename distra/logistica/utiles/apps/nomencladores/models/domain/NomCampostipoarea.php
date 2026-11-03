<?php

class NomCampostipoarea extends BaseNomCampostipoarea
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomTipoarea',
            array('local' => 'idnomtipoarea', 'foreign' => 'idtipoarea')
        );

    }


}//fin clase 
