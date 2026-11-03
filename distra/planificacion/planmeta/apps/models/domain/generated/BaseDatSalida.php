<?php

abstract class BaseDatSalida extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('dat_salida');
        $this->hasColumn(
                'cantidad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idactividad', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
                'idindicador', 'numeric', null, array('notnull' => true, 'primary' => true)
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
