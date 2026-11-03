<?php

abstract class BaseDatElementoEstructuraCrea extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.dat_elementoestructuracrea');
        $this->hasColumn(
            'idelementoestructuracrea', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planifproyecto.sec_elementoestructuracrea_seq')
        );
       
        $this->hasColumn(
            'idelemento', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
		 $this->hasColumn(
            'idestructuracrea', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
       
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase


