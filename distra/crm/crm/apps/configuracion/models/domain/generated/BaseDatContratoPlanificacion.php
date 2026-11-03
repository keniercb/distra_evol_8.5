<?php

abstract class BaseDatContratoPlanificacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmadministracion.dat_contratoplanificacion');
        $this->hasColumn(
            'idcontratoplanificacion', 'numeric', 19,
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
