<?php

abstract class BaseDatFormulatablacalorica extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_formulatablacalorica');
        $this->hasColumn(
            'idformula', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idtablacalorica', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        
        $this->hasColumn(
            'cantidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'porciento', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );        
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
