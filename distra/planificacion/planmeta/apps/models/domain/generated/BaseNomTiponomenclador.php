<?php

abstract class BaseNomTiponomenclador extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('nom_tiponomenclador');
        $this->hasColumn('idtiponomenclador', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planificacion.sec_tiponomenclador'));
        $this->hasColumn('denominacion', 'varchar', 100, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'varchar', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('configsistema', 'numeric', 1, array('default' => 0, 'notnull' => true));
        $this->hasColumn('uritiponomenclador', 'varchar', 100, array('notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}
