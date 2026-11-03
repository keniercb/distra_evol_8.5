<?php

class DatTipotransfinternaEntidad extends BaseDatTipotransfinternaEntidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomTipotransfinterna',
            array('local'   => 'idtipotransfinterna',
                  'foreign' => 'idtipotransfinterna')
        );
    }

}

//fin clase


