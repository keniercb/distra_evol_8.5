<?php

class DatTipotransferenciaEntidad extends BaseNomTransferenciaareaentidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomTipotransferencia',
            array('local'   => 'idtipotransferencia',
                  'foreign' => 'idtipotransferencia')
        );
    }

}

//fin clase


