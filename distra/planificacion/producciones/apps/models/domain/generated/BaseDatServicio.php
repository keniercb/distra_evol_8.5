<?php

abstract class BaseDatServicio extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_spouam.dat_servicio');
        $this->hasColumn(
                'idservicio', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_spouam.sec_servicio')
        );
        $this->hasColumn(
                'gasto', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
                'idactividad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idcartatecnologicaactividad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idaplicacioncartatec', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'fecha', 'timestamp', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idusuario', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();
        $this->hasOne(
                'DatAplicacioncartatec', array('local' => 'idaplicacioncartatec',
            'foreign' => 'idaplicacioncartatec')
        );
    }

}
