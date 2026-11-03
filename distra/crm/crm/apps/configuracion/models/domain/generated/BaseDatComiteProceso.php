<?php

abstract class BaseDatComiteProceso extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmadministracion.dat_comiteproceso');
        $this->hasColumn(
            'idcomiteproceso', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_crmadministracion.sec_comiteproceso')
        );
        $this->hasColumn('idcomite', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idproceso', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
