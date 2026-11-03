<?php

abstract class BaseDatActividadentidadprodcartatec extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_spouam.dat_actividadentidadprodcartatec');
        $this->hasColumn(
                'idactividadentidadprodcartatec', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_spouam.sec_actividadentidadprodcartatec')
        );
        $this->hasColumn(
                'idactividadentidad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'nivelactividadproduccion', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'nivelactividadejecucion', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'version', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 1)
        );
        $this->hasColumn(
                'idaplicacioncartatec', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idcartatecnologicaactividad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'iddatosnomenclador', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'fechainicio', 'timestamp', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'fechafin', 'timestamp', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'fechaejecucion', 'timestamp', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();

        $this->hasOne(
                'DatAplicacioncartatec', array('local' => 'idaplicacioncartatec',
            'foreign' => 'idaplicacioncartatec')
        );
        $this->hasOne(
                'DatCartatecnologicaactividad', array('local' => 'idcartatecnologicaactividad',
            'foreign' => 'idcartatecnologicaactividad')
        );
    }

}
