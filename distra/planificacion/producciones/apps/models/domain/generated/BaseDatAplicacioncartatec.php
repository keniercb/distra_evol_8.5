<?php

abstract class BaseDatAplicacioncartatec extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_spouam.dat_aplicacioncartatec');
        $this->hasColumn(
                'idaplicacioncartatec', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_spouam.sec_aplicacioncartatec')
        );
        $this->hasColumn(
                'idcartatecnologica', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'identidad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'nivelactividad', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
                'fecha', 'timestamp', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'fechainicio', 'timestamp', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'fechafin', 'timestamp', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'asegurado', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
                'productividadest', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
                'volumenproduccionhistorico', 'numeric', null, array('notnull' => false, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
                'idaprobacion', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 1)
        );
        $this->hasColumn(
                'idusuario', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idcartatecnologicaentidad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'fechamodificacion', 'timestamp', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();

        $this->hasOne(
                'DatCartatecnologica', array('local' => 'idcartatecnologica',
            'foreign' => 'idcartatecnologica')
        );
        $this->hasMany(
                'DatActividadentidadprodcartatec', array('local' => 'idaplicacioncartatec',
            'foreign' => 'idaplicacioncartatec')
        );
        $this->HasMany(
                'DatServicio', array('local' => 'idaplicacioncartatec',
            'foreign' => 'idaplicacioncartatec')
        );
        $this->HasMany(
                'DatArrendamiento', array('local' => 'idaplicacioncartatec',
            'foreign' => 'idaplicacioncartatec')
        );
    }

}
