<?php

abstract class BaseDatDistribucioncod extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_plan711.dat_distribucioncod');
        $this->hasColumn(
                'iddistribucioncod', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_plan711.sec_distribucioncod')
        );
        $this->hasColumn(
                'idplan711', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idproducto711', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'iddatoscodigo', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'iddatosempimp', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        
        $this->hasColumn(
                'valor', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'precio', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'cantidad', 'numeric', null, array('notnull' => true, 'primary' => false)
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