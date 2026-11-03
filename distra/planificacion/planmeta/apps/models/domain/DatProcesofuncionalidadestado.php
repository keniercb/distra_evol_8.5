<?php

class DatProcesofuncionalidadestado extends BaseDatProcesofuncionalidadestado
{

    public function setUp()
    {
        parent::setUp();

        $this->hasOne(
            'DatProcesofuncionalidad',
            array('local'   => 'idprocesofuncionalidad',
                  'foreign' => 'idprocesofuncionalidad')
        );
        $this->hasOne(
            'NomDatosnomenclador',
            array('local' => 'idestado', 'foreign' => 'iddatosnomenclador')
        );
        $this->hasOne(
            'NomEjercicioplanificacion',
            array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
        $this->hasOne(
            'DatProcesofuncionalidadentidad',
            array('local'   => 'idprocesofuncionalidadestado',
                  'foreign' => 'idprocesofuncionalidadestado')
        );
    }

}
