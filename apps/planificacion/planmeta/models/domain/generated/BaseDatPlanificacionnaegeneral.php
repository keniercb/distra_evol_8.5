<?php

abstract class BaseDatPlanificacionnaegeneral extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_planificacionnaegeneral');
        $this->hasColumn(
            'idplanificacionnaegeneral', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_planificacionnaegeneral')
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->HasOne(
            'DatPlanificacionnaeobjetogasto',
            array('local'   => 'idplanificacionnaegeneral',
                  'foreign' => 'idplanificacionnaegeneral')
        );
        $this->HasOne(
            'DatPlanificacionnaeingreso',
            array('local'   => 'idplanificacionnaegeneral',
                  'foreign' => 'idplanificacionnaegeneral')
        );
        $this->HasMany(
            'DatPlanificacionnae', array('local'   => 'idplanificacionnaegeneral',
                                         'foreign' => 'idplanificacionnaegeneral')
        );
        $this->HasMany(
            'DatActividadentidadnae',
            array('local'   => 'idplanificacionnaegeneral',
                  'foreign' => 'idplanificacionnaegeneral')
        );
    }

}


