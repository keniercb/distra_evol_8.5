<?php

abstract class BaseDatEvalpersonaevaluacion extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_evaluaciones.dat_evalpersonaevaluacion');
        $this->hasColumn('idpersonaevaluacion', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_dat_evalpersonaevaluacion'));
        $this->hasColumn('idestructurapersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idperiodoproceso', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('deacuerdo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('hareclamado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcausanoevaluado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechaevaluado', 'timestamp', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('resultado', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valor', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idescala', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestadodesarrollo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idplanilla', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmodelo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersonaevaluador', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersonaevaluado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nopersona', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcaso', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}