<?php

abstract class BaseNomNaturaleza extends Doctrine_Record {
    public function setTableDefinition () {
        $this->setTableName ('mod_datosmaestros.nom_naturaleza');
        $this->hasColumn ('idnaturaleza', 'numeric', null, array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_naturaleza'));
        $this->hasColumn ('denominacion', 'string', null, array('type' => 'string', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn ('ordenizq', 'numeric', null, array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn ('ordender', 'numeric', null, array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn ('idpadre', 'numeric', null, array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn ('estado', 'numeric', null, array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn ('codigo', 'string', null, array('type' => 'string', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn ('codigocontable', 'string', null, array('type' => 'string', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn ('naturalezalote', 'numeric', null, array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false));
    }

    public function setUp () {
        parent::setUp ();

    }
}
