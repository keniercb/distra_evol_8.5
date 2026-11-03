<?php

abstract class BaseCfgReporte extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.conf_reporteaft');
        $this->hasColumn(
            'idconfreporteaft', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logactivofijotangible.sec_confreporteaft')
        );
        $this->hasColumn(
            'idreporte', 'numeric', null, array('notnull' => false, 'primary' => false)
        );

        $this->hasColumn(
            'nombrecampo', 'character varying', 255, array('notnull' => true, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
