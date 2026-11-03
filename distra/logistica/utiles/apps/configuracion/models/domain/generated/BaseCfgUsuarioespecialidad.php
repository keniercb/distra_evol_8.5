<?php

abstract class BaseCfgUsuarioespecialidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.conf_usuarioespecialidad');
        $this->hasColumn('idusuarioespecialidad', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idespecialidad', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
