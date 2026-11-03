<?php

abstract class BaseDatControlMedios extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.conf_controlmedios');
        $this->hasColumn(
            'idatributocontrol', 'numeric', null,
            array(
            'notnull' => true, 'primary' => true,
            'sequence' => 'mod_logactivofijotangible.sec_controlmedios'
            )
        );
        $this->hasColumn(
            'idcampo', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtabla', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nombretabla', 'character varying', 255, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 255, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
