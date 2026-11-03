<?php

abstract class BaseDatFormulaactividad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_formulaactividad');
        $this->hasColumn(
            'idformula', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idactividad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );        
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
