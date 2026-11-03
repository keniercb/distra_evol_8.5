<?php

abstract class  BaseConfDocDatEstado extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_flujotrabajo.conf_doc_dat_estado');
        $this->hasColumn(
            'idestado', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idtipodoc', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'inicial', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'notificacion', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'idautor', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}


