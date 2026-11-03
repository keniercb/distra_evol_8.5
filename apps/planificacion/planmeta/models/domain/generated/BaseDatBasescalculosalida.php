<?php

abstract class BaseDatBasescalculosalida extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('dat_basescalculosalida');
        $this->hasColumn(
                'idbasescalculosalida', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_planificacion.sec_basescalculo')
        );
        $this->hasColumn(
                'idindicador', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'necesidad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'importe', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'identidad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idmodelo', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idejercicio', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idespecialidad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'importemlc', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'importeflete', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'importecontingencia', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'precio', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'preciomlc', 'numeric', null, array('notnull' => true, 'primary' => false)
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
