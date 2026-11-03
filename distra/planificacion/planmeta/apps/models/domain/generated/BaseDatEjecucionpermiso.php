<?php

class BaseDatEjecucionpermiso extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_ejecucionpermiso');
        $this->hasColumn(
            'idejecucionpermiso', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_ejecucionpermiso')
        );
        $this->hasColumn(
            'idcentrobalance', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idejercicio', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'puntualizar', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->HasMany(
            'DatEntidaddatosnomenclador', array('local'   => 'idcentrobalance',
                                                'foreign' => 'identidaddatosnomenclador')
        );
        $this->HasMany(
            'NomEjercicioplanificacion',
            array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
    }

}


