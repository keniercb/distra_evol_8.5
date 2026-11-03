<?php

abstract class BaseDatEmbarqueFormaPago extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_plan711.dat_embarqueformapago');
        $this->hasColumn(
                'idembarqueformapago', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_plan711.sec_embarqueformapago')
        );
        $this->hasColumn(
                'idembarque', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'iddatosformapago', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'fechaposible', 'timestamp', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'fechareal', 'timestamp', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'porciento', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'monto', 'numeric', null, array('notnull' => false, 'primary' => false)
        );     
    }

    public function Setup() {
        parent::setUp(); 
        
    }

}
