<?php

abstract class BaseDatDemandatiempo extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planproeza.dat_demandatiempo');
        $this->hasColumn('iddemandatiempo', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planproeza.sec_demandatiempo'));
        $this->hasColumn('iddemanda', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('identidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('tieneobservacion', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidaddesglosada', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('preciodesglosado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('preciodesglosadodivisa', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importe', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('importedivisa', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('enero', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('febrero', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('marzo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('abril', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('mayo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('junio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('julio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('agosto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('septiembre', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('octubre', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('noviembre', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('diciembre', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fecha', 'timestamp without time zone', null, array('default' => 'now()', 'notnull' => true));
        $this->hasColumn('ajusteplan', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('importeajustado', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('importeajustadodivisa', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}

//fin clase

