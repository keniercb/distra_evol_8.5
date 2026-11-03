<?php

abstract class BaseDatComiteTransicion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmadministracion.dat_comitetransicion');
        $this->hasColumn(
            'idcomitetransicion', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_crmadministracion.sec_comitetransicion')
        );
        $this->hasColumn('idtransicion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('reglas', 'json', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcomite', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
