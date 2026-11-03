<?php

abstract class BaseCfgEstadosEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.conf_operacionesestados');
        $this->hasColumn(
            'idestadosentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true,
            'sequence' => 'sec_cfgestadosentidad')
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestado', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idoperacion', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idproximoestado', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
