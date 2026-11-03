<?php

class DatDesglosecompleto extends BaseDatDesglosecompleto
{

    public function setUp()
    {
        parent::setUp();

        $this->hasOne(
            'DatDesglosetiponomenclador',
            array('local'   => 'iddesglosetiponomenclador',
                  'foreign' => 'iddesglosetiponomenclador')
        );
        $this->hasOne(
            'DatActividadentidad', array('local'   => 'idactividadentidad',
                                         'foreign' => 'idactividadentidad')
        );
        $this->hasOne(
            'NomEjercicioplanificacion',
            array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
    }

}
