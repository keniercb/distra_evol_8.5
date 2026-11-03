<?php

abstract class  BaseDatEstado extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_flujotrabajo.dat_estado');
        $this->hasColumn(
            'denominacion', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idautor', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestado', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_flujotrabajo.sec_datestado')
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}


