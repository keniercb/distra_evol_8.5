<?php

abstract class BaseDatElementoEstructuraUsa extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.dat_elementoestructurausa');
        $this->hasColumn(
            'idelementoestructurausa', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planifproyecto.sec_elementoestructurausa_seq')
        );
       
        $this->hasColumn(
            'idelementoestructuracrea', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
		 $this->hasColumn(
            'idestructurausa', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
       
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase


