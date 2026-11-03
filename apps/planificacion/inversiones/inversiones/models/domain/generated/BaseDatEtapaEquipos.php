<?php

abstract class BaseDatEtapaEquipos extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_etapaequipos');
        $this->hasColumn('idetapaequipos', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_etapaequipos'));
        $this->hasColumn('idindicador', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('identidadmodelo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idequipoplan', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idejercicio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('precio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idunidadmedida', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcentrobalance', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importe', 'numeric', null, array('notnull' => false, 'primary' => false));
        //$this->hasColumn('idaprobaciondemanda', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('preciodivisa', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importedivisa', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idetapainversion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idadquisicion', 'numeric', null, array('null' => true, 'primary' => false));
        $this->hasColumn('idcomprar', 'numeric', null, array('null' => true, 'primary' => false));
        $this->hasColumn('idcomprarpais', 'numeric', null, array('null' => true, 'primary' => false));
        $this->hasColumn('observaciones', 'string', null, array('null' => true, 'primary' => false));
    }

}

