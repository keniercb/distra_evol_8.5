<?php

abstract class BaseDatContratoContabilidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmadministracion.dat_contratocontabilidad');
        $this->hasColumn(
            'idcontratocontabilidad', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_crmadministracion.sec_contratoplanificacion')
        );
        $this->hasColumn('activo', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
