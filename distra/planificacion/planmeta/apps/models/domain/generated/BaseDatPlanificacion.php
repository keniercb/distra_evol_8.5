<?php

abstract class BaseDatPlanificacion extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planificacion.dat_planificacion');
        $this->hasColumn('idplanificacion', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planificacion.sec_planificacion'));
        $this->hasColumn('idaprobaciondemanda', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idindicador', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('identidadmodelo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idejercicio', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idunidadmedida', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcentrobalance', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('precio', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('preciodivisa', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importe', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importedivisa', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('generadobasesplan', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ajuste', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('centrosbalance', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('viasadquisicion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('organossatisface', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fecha', 'timestamp', null, array('default' => 'now()', 'notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}

//fin clase 


