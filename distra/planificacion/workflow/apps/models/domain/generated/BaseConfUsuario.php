<?php

abstract class  BaseConfUsuario extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('conf_usuario');
        $this->hasColumn(
            'idusuario', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'nombre', 'character varying', 100,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}


