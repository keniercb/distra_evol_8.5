<?php

class DatActividadentidadmanual extends BaseDatActividadentidadmanual
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatActividadentidad',
            array('local'   => 'idactividadentidad',
                  'foreign' => 'idactividadentidad')
        );
    }

}

