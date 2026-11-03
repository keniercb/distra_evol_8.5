<?php

abstract class BaseDatCompartimentacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmadministracion.dat_compartimentacion');
        $this->hasColumn(
            'idcompartimentacion', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_crmadministracion.sec_compartimentacion')
        );
        $this->hasColumn('idrol', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('definicion', 'json', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('modulo', 'string', null, array('notnull' => true, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
