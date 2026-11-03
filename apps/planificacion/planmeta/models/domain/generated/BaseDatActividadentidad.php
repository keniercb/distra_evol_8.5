<?php

abstract class BaseDatActividadentidad extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('dat_actividadentidad');
        $this->hasColumn(
                'idactividadentidad', 'numeric', null,
                array('notnull' => true, 'primary' => true,
                    'sequence' => 'mod_planificacion.sec_actentidad')
        );
        $this->hasColumn(
                'identidad', 'numeric', null,
                array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idejercicio', 'numeric', null,
                array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idactividad', 'numeric', null,
                array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idaprobacion', 'numeric', null,
                array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'version', 'numeric', null,
                array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'ajuste', 'numeric', 0, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idactespcomportamiento', 'numeric', null,
                array('notnull' => true, 'primary' => false)
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
