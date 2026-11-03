<?php

abstract class BaseDatGestpersonadel711 extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_plan711.dat_personadel711');
        $this->hasColumn(
                'idpersonadel711', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_plan711.sec_personadel711')
        );
        $this->hasColumn(
                'nombre', 'text', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'apellidos', 'text', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'iddatostp', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'identidad', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'iddatosempimp', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'iddatoscategoria', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'correoelec', 'text', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'telefono', 'text', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'iddatosuc', 'numeric', null, array('notnull' => false, 'primary' => false)
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