<?php

abstract class BaseConfAccesoDirecto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmadministracion.conf_accesodirecto');
        $this->hasColumn(
            'idaccesodirecto', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_crmadministracion.sec_accesodirecto')
        );
        $this->hasColumn('idestructura', 'numeric', 19, array('notnull' => false));
        $this->hasColumn('idusuario', 'numeric', 19, array('notnull' => false));
        $this->hasColumn('idfuncionalidad', 'numeric', 19, array('notnull' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
