<?php

abstract class  BaseDatCondicion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_condicion');
        $this->hasColumn(
            'condicion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idcondicion', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_flujotrabajo.sec_datcondicion')
        );
        $this->hasColumn(
            'idtransicion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'tipo', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}


