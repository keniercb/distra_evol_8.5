<?php

abstract class BaseDatPlanificacionnae extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_planificacionnae');
        $this->hasColumn(
            'idnae', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idplanificacion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idplanificacionnae', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_planificacionnae')
        );
        $this->hasColumn(
            'idplanificacionnaegeneral', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idejercicio', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->hasOne(
            'DatPlanificacionnaegeneral',
            array('local'   => 'idplanificacionnaegeneral',
                  'foreign' => 'idplanificacionnaegeneral')
        );
        $this->hasOne(
            'DatPlanificacion',
            array('local' => 'idplanificacion', 'foreign' => 'idplanificacion')
        );
        $this->hasOne(
            'NomEjercicioplanificacion',
            array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
    }

}


