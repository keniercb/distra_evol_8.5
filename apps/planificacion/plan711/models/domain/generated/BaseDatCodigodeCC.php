<?php

abstract class BaseDatCodigodeCC extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_plan711.dat_codigodecc');
        $this->hasColumn(
                'idcodigodecc', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_plan711.sec_codigodecc')
        );
        $this->hasColumn(
                'idplan711', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'iddatoscc', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'iddatosempimp', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'identidad', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        
        $this->hasColumn(
                'codigo', 'text', null, array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();

        $this->hasOne(
                'DatPlan711', array('local' => 'idplan711',
            'foreign' => 'idplan711')
        );
        
    }

}

?>