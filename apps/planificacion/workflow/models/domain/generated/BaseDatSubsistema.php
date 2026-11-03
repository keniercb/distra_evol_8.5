<?php

abstract class  BaseDatSubsistema extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_subsistema');
        $this->hasColumn(
            'densubsistema', 'character varying', 100,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idsubsistema', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_flujotrabajo.sec_datsubsistema')
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}


