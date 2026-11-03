<?php

abstract class BaseDatContrato extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_plan711.dat_contrato');
        $this->hasColumn(
                'idcontrato', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_plan711.sec_contrato')
        );
        $this->hasColumn(
                'nocontrato', 'text', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'fechacontratacion', 'timestamp', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'totalcontratado', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'idsolicitud711', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'ratecambio', 'numeric', null, array('notnull' => false, 'primary' => false)
        );        
        $this->hasColumn(
                'iddatosproveedor', 'numeric', null, array('notnull' => false, 'primary' => false)
        );        
    }

    public function Setup() {
        parent::setUp(); 
        
    }

}
