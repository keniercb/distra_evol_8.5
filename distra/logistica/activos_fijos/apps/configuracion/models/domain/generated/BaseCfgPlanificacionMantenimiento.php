<?php

abstract class BaseCfgPlanificacionMantenimiento extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.conf_planificacionmantenimiento');
        $this->hasColumn(
            'idplanificacionmantenimiento', 'numeric', null,
            array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_logactivofijotangible.sec_confplanificacionmantenimiento')
        );
        $this->hasColumn(
            'periodo', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'recursoconsumido', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
