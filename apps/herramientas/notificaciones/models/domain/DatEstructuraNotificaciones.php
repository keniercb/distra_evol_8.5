<?php

class DatEstructuraNotificaciones extends BaseDatEstructuraNotificaciones
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatDestinatario',
            array('local' => 'iddestinatario', 'foreign' => 'iddestinatario')
        );
    }

}