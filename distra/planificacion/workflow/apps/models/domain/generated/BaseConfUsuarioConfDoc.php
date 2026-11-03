<?php

abstract class BaseConfUsuarioConfDocDatEstado extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('conf_usuario_conf_doc_dat_estado');
        $this->hasColumn(
            'idestado', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idtipodoc', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idusuario', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'tipo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}//fin clase


