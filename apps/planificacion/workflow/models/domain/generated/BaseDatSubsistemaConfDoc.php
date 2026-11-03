<?php

abstract class  BaseDatSubsistemaConfDoc extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_subsistema_conf_doc');
        $this->hasColumn(
            'idsubsistema', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idtipodoc', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}


