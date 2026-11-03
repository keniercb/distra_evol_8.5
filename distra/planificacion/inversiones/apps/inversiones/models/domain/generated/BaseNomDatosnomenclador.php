<?php

abstract class BaseNomDatosnomenclador extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planificacion.nom_datosnomenclador');
        $this->hasColumn(
                'iddatosnomenclador', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planificacion.sec_datosnomenclador')
        );
        $this->hasColumn('denominacion', 'varchar', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'varchar', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('color', 'varchar', 20, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtiponomenclador', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('uridatosnomenclador', 'varchar', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantdescendente', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantascendente', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}

//fin clase
?>