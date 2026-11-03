<?php

abstract class  BaseConfDoc extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_flujotrabajo.conf_doc');
        $this->hasColumn(
            'denominacion', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipodoc', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_flujotrabajo.sec_nomdocprim')
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}


