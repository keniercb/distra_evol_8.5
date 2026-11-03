<?php

abstract class BaseDatDesglose extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_desglose');
        $this->hasColumn(
            'iddesglose', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_desglose')
        );
        $this->hasColumn(
            'denominacion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );       
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase


