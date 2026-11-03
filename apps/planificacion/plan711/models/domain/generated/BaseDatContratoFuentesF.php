<?php

abstract class BaseDatContratoFuentesF extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_plan711.dat_contratofuentesf');
        $this->hasColumn(
                'idcontratofuentesf', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_plan711.sec_contratofuentesf')
        );
        $this->hasColumn(
                'idcontrato', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'monto', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'codigofactura', 'text', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'fechaposible', 'timestamp', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'fechareal', 'timestamp', null, array('notnull' => true, 'primary' => false)
        );       
    }

    public function Setup() {
        parent::setUp(); 
        
    }

}
