<?php

class DatExistenciaarea extends BaseDatExistenciaarea
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatAreaproducto', array('local'   => 'idexistenciaarea',
                                     'foreign' => 'idexistenciaarea')
        );
        $this->hasOne(
            'DatAreabulto', array('local'   => 'idexistenciaarea',
                                  'foreign' => 'idexistenciaarea')
        );
        $this->hasOne(
            'DatEstructuraubicacion', array('local' => 'idarea', 'foreign' => 'idarea')
        );
    }

}



