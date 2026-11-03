<?php

abstract class BaseDatEmbarqueCubicaje extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_plan711.dat_embarquecubicaje');
        $this->hasColumn(
                'idembarquecubicaje', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_plan711.sec_embarquecubicaje')
        );
        $this->hasColumn(
                'idembarque', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'iddatoscubicaje', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'cantidad', 'numeric', null, array('notnull' => false, 'primary' => false)
        );      
    }

    public function Setup() {
        parent::setUp(); 
        
    }

}
