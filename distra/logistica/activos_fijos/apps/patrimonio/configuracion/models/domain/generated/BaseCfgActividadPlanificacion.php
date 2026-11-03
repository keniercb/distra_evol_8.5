<?php

abstract class BaseCfgActividadPlanificacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.conf_actividadplanificacion');
        $this->hasColumn(
            'idactividadplanificacion', 'numeric', null,
            array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_logactivofijotangible.sec_confactividadplanificacion')
        );
        $this->hasColumn(
            'idconfactividadsistemamedio', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idplanificacionmantenimiento', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
