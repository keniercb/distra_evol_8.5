<?php

abstract class BaseNomFormatopredefinido extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_formatopredefinido');
        
        $this->hasColumn(
            'idformato', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idformatopredefinido', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_formatopredefinido')
        );
        
    }

    public function Setup()
    {
        parent::setUp();
    
    }

}


