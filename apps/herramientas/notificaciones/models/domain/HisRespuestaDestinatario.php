<?php

class HisRespuestaDestinatario extends BaseHisRespuestaDestinatario
{

    public function setUp()
    {
        parent::setUp();
        $this->HasOne(
            'HisRespuestaTarea',
            array('local' => 'idrespuestatarea', 'foreign' => 'idrespuesta')
        );
    }
}