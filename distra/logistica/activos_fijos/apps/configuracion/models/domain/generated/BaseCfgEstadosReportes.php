<?php

class BaseCfgEstadosReportes extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.conf_estadosreportes');
        $this->hasColumn(
            'idestado', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'denomcolumnareporte', 'character varying', 255, array('notnull' => false, 'primary' => true)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
