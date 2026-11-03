<?php

abstract class BaseNomReporte extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.nom_reporte');
        $this->hasColumn('idreporte', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_reporte_seq'));
        $this->hasColumn('codigo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('categoria', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('configuracion', 'character varying', 500, array('notnull' => true, 'primary' => false));
    }

   

}