<?php

abstract class BaseDatModeloclasifmodelo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_modeloclasifmodelo');
        $this->hasColumn(
            'idmodelo', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_modelo')
        );
        $this->hasColumn(
            'idclasifmodelo', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase


