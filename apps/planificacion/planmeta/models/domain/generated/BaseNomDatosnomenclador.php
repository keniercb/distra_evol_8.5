<?php

abstract class BaseNomDatosnomenclador extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planificacion.nom_datosnomenclador');
        $this->hasColumn('iddatosnomenclador', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planificacion.sec_datosnomenclador'));
        $this->hasColumn('denominacion', 'varchar', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'varchar', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtiponomenclador', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('uridatosnomenclador', 'varchar', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantdescendente', 'numeric', null, array('default' => 0, 'notnull' => true, 'primary' => false));
        $this->hasColumn('cantascendente', 'numeric', null, array('default' => 0, 'notnull' => true, 'primary' => false));
        $this->hasColumn('valordefecto', 'numeric', 1, array('default' => 0, 'notnull' => true));
        $this->hasColumn('activacion', 'numeric', 1, array('default' => 1, 'notnull' => true));
        $this->hasColumn('orden', 'numeric', 4, array('default' => 9999, 'notnull' => true));
    }

    public function Setup() {
        parent::setUp();
    }

}
