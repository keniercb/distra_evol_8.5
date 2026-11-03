<?php

abstract class BaseDatActividadcargo extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planificacion.dat_actividadcargo');
        $this->hasColumn(
                'idactividadcargo', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_planificacion.sec_actividadcargo')
        );
        $this->hasColumn(
                'idactividad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idcargo', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'cantidad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
		$this->hasColumn(
                'duracion', 'numeric', null, array('notnull' => true, 'primary' => false)
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
