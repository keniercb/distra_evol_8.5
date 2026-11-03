<?php

abstract class BaseDatNominaDatos extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.dat_nominadatos');

        $this->hasColumn('idnominadatos', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_dat_nominadatos'
        ));
        
        $this->hasColumn('idnomina', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
        $this->hasColumn('campos', 'text', null, array(
            'type' => 'text',
            'length' => null,
            'notnull' => true,
            'primary' => false
        ));
        
        $this->hasColumn('valores', 'text', null, array(
            'type' => 'text',
            'length' => null,
            'notnull' => true,
            'primary' => false
        ));
        
        $this->hasColumn('estructura', 'text', null, array(
            'type' => 'text',
            'length' => null,
            'notnull' => true,
            'primary' => false
        ));
        
        $this->hasColumn('idplantillanominal', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
    }
}
