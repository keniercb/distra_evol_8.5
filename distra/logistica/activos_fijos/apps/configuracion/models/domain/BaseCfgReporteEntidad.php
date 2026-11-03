<?php

abstract class BaseCfgReporteEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.conf_reporteaftentidad');
        $this->hasColumn(
            'idconfreporteaftentidad', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logactivofijotangible.sec_confreporteaftentidad')
        );
        $this->hasColumn(
            'idconfreporteaft', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestructura', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'valor', 'character varying', 500, array('notnull' => true, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
