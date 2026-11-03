<?php

abstract class BaseDatActividadentidadnae extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_actividadentidadnae');
        $this->hasColumn(
            'idactividadentidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idactividadentidadnae', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_actividadentidadnae')
        );
        $this->hasColumn(
            'idnae', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idplanificacionnaegeneral', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}


