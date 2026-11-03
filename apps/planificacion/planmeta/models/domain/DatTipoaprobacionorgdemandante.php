<?php

class DatTipoaprobacionorgdemandante extends BaseDatTipoaprobacionorgdemandante
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomDatosnomenclador',
            array('local'   => 'idtipoaprobacion',
                  'foreign' => 'iddatosnomenclador')
        );
    }

}

