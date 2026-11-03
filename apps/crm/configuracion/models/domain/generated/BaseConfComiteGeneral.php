<?php

abstract class BaseConfComiteGeneral extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmadministracion.conf_comitegeneral');
        $this->hasColumn(
            'idcomitegeneral', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_crmadministracion.sec_comitegeneral')
        );
        $this->hasColumn('nombre', 'string', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('pordefecto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'string', null, array('notnull' => true, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
