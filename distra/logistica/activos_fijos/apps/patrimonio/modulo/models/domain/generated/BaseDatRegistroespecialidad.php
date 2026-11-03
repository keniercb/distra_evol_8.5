<?php

class BaseDatRegistroespecialidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.dat_registroespecialidad');        
        $this->hasColumn('idregnumerico', 'numeric', 19, array('notnull' => true, 'primary' => true));       
        $this->hasColumn('denominacion', 'character varying',20, array('notnull' => false, 'primary' => false));        

    }
}
