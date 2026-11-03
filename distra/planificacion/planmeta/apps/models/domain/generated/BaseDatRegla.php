<?php

abstract class BaseDatRegla extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('dat_regla');
        $this->hasColumn(
                'idregla', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_planificacion.sec_regla')
        );
        $this->hasColumn(
                'denominacion', 'varchar', 255, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'valorcontrol', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'nivelactividadbase', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idnorma', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idactividaddestino', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idactividadorigen', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'version', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idejercicio', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idusuario', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'fecha', 'timestamp', null, array('default' => 'now()', 'notnull' => true, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();
    }

}

//fin clase
