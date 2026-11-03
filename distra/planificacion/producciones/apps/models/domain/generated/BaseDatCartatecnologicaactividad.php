<?php

abstract class BaseDatCartatecnologicaactividad extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_spouam.dat_cartatecnologicaactividad');
        $this->hasColumn(
                'idcartatecnologica', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idactividad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'plazo', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
                'duracion', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 1)
        );

        $this->hasColumn(
                'idcartatecnologicaactividad', 'numeric', null, array('notnull' => true, 'primary' => true,
            'secuence' => 'mod.spouam.sec_cartatecnologicaactividad')
        );
        $this->hasColumn(
                'idetapa', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'diacero', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
                'idusuario', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'fecha', 'timestamp', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idusuario', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'fecha', 'date', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'porciento', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0)
        );
    }

    public function Setup() {
        parent::setUp();
        $this->hasOne(
                'DatCartatecnologica', array('local' => 'idcartatecnologica',
            'foreign' => 'idcartatecnologica')
        );
    }

}
