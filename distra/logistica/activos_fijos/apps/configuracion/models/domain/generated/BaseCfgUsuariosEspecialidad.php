<?php

class BaseCfgUsuariosEspecialidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName(
            'mod_logactivofijotangible.conf_usuarioespecialidad'
        );
        $this->hasColumn(
            'idusuario', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idespecialidad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
