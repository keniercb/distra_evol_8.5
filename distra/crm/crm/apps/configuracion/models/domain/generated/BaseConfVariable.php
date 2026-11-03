<?php

abstract class BaseConfVariable extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmadministracion.conf_variables');
        $this->hasColumn(
            'idvariable', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_crmadministracion.sec_variable')
        );
        $this->hasColumn('nombre', 'string', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'string', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('sql', 'string', null, array('notnull' => true, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
