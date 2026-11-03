<?php

abstract class BaseNomNomenclador extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planificacion.nom_nomenclador');
        $this->hasColumn('idnomenclador', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planificacion.sec_nomenclador'));
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('uri', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpadre', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('valordefecto', 'numeric', 1, array('default' => 0, 'notnull' => true));
        $this->hasColumn('activacion', 'numeric', 1, array('default' => 1, 'notnull' => true));
        $this->hasColumn('orden', 'numeric', 4, array('default' => 9999, 'notnull' => true));
        $this->hasColumn('parentpath', 'ltree', 250, array('fixed' => false, 'notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}
