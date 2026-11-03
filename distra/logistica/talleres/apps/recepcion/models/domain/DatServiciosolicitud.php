<?php

class DatServiciosolicitud extends BaseDatServiciosolicitud
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatPlansolicitud', array('local' => 'idplansolicitud', 'foreign' => 'idplansolicitud')
        );

    }

}

