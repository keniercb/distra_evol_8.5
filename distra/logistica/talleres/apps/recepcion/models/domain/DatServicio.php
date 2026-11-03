<?php

class DatServicio extends BaseDatServicio
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatPlansolicitud', array('local' => 'idplansolicitud', 'foreign' => 'idplansolicitud')
        );

    }

}

