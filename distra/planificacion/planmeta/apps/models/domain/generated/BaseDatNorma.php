<?php

abstract class BaseDatNorma extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('dat_norma');
        $this->hasColumn(
                'idnorma', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_planificacion.sec_norma')
        );
        $this->hasColumn(
                'idactividad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idindicador', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'cantbase', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'cantplanif', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'version', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idejercicio', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'necesidad', 'numeric', 0, array('notnull' => true, 'primary' => false)
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
