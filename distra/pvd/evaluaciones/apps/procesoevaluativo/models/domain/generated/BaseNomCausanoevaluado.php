<?php

abstract class BaseNomCausanoevaluado extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_evaluaciones.nom_causanoevaluado');
        $this->hasColumn('idcausanoevaluado', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_nom_causanoevaluado'));
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}

?>