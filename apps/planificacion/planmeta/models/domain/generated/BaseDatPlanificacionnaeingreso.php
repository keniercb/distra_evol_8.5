<?php

abstract class BaseDatPlanificacionnaeingreso extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_planificacionnaeingreso');
        $this->hasColumn(
            'idingreso', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idplanificacionnaegeneral', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->hasOne(
            'DatPlanificacionnaegeneral',
            array('local' => 'idplanificacionnaegeneral',
                  'foreign' => 'idplanificacionnaegeneral')
        );
    }

}


