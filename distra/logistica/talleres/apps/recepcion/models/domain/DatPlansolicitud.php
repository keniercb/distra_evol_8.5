<?php

class DatPlansolicitud extends BaseDatPlansolicitud
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatDocumento', array('local' => 'idplansolicitud', 'foreign' => 'iddocumento')
        );
        /* $this->hasOne(
             'DatOrdenTrabajo',
             array('local' => 'idplansolicitud', 'foreign' => 'iddocumentoorigen')
         );*/
        $this->hasMany(
            'NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador')
        );

    }


}


