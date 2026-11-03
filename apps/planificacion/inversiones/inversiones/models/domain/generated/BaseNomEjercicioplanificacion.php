<?php

abstract class BaseNomEjercicioplanificacion extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planificacion.nom_ejercicioplanificacion');
        $this->hasColumn(
                'idejercicio', 'numeric', null, array('notnull' => true, 'primary' => true,
            'secuence' => 'mod_planificacion.sec_ejercicioplanificacion_seq')
        );
        $this->hasColumn('ejercicio', 'character varying', 100, array('notnull' => true, 'primary' => false));
        $this->hasColumn('actual', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('margenc', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestado', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}

//fin clase
?> 
