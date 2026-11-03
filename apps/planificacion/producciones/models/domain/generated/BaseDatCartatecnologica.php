<?php

abstract class BaseDatCartatecnologica extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_spouam.dat_cartatecnologica');
        $this->hasColumn(
                'idcartatecnologica', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_spouam.sec_cartatecnologica')
        );
        $this->hasColumn(
                'denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'fecha', 'timestamp', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'valorrendimiento', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idumedidarendimiento', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idvariablecontrol', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'estado', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
                'idaprobacion', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'identidadcrea', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idindicador', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idtipomodelo', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idmodelo', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'enuso', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
                'idusuario', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();
        $this->HasMany(
                'DatCartatecnologicaactividad', array('local' => 'idcartatecnologica', 'foreign' => 'idcartatecnologica')
        );
        $this->HasMany(
                'DatAplicacioncartatec', array('local' => 'idcartatecnologica', 'foreign' => 'idcartatecnologica')
        );

        $this->HasOne(
                'DatVariablecontrol', array('local' => 'idvariablecontrol', 'foreign' => 'idvariablecontrol')
        );
        $this->HasMany(
                'DatCartatecnologicaentidad', array('local' => 'idcartatecnologica', 'foreign' => 'idcartatecnologica')
        );
        $this->HasMany(
                'DatCartatecnologicadepreciacionequipo', array('local' => 'idcartatecnologica', 'foreign' => 'idcartatecnologica')
        );
    }

}
