<?php

class DatAjusteplanificacion extends BaseDatAjusteplanificacion
{

    public function setUp()
    {
        parent::setUp();

        $this->hasOne(
            'DatPlanificacion',
            array('local' => 'idplanificacion', 'foreign' => 'idplanificacion')
        );
        $this->hasOne(
            'DatEntidadmodelo',
            array('local' => 'identidadmodelo', 'foreign' => 'identidadmodelo')
        );
        $this->hasOne(
            'NomEjercicioplanificacion',
            array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
    }

}
