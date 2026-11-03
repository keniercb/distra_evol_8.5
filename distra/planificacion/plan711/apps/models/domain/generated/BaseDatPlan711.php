<?php

abstract class BaseDatPlan711 extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_plan711.dat_plan711');
        $this->hasColumn(
                'idplan711', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_plan711.sec_plan711')
        );
        $this->hasColumn(
                'montototal', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idejercicio', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'idtipoplan', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'activo', 'boolean', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();
/*
        $this->hasOne(
                'DatSolicitudcontrato', array('local' => 'idsolicitudcontrato',
            'foreign' => 'idsolicitudcontrato')
        );*/
        
    }

}

?>