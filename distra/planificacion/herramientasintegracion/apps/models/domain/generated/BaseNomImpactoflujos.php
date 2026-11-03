<?php

abstract class BaseNomImpactoflujos extends Doctrine_Record
{

    public function setTableDefinition() {
        $this->setTableName('mod_planifintegracion.nom_impactoflujos');
        $this->hasColumn('idimpacto', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifintegracion.sec_impacto'));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('peso', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechaini', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => true, 'primary' => false));
    }
}