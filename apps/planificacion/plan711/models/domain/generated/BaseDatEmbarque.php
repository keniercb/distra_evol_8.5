<?php

abstract class BaseDatEmbarque extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_plan711.dat_embarque');
        $this->hasColumn(
                'idembarque', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_plan711.sec_embarque')
        );
        $this->hasColumn(
                'idcontrato', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'iddatosaccion', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'iddatosff', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'monto', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'fechaposible', 'timestamp', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'fechareal', 'timestamp', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'codigofactura', 'text', null, array('notnull' => false, 'primary' => false)
        );        
        $this->hasColumn(
                'uricondicion', 'text', null, array('notnull' => false, 'primary' => false)
        );        
    }

    public function Setup() {
        parent::setUp(); 
        
    }

}
