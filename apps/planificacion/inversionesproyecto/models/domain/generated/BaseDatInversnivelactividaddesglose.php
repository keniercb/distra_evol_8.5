<?php

abstract class BaseDatInversnivelactividaddesglose extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_inversnivelactividaddesglose');
        $this->hasColumn('idinversnivelactividaddesglose', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_inversnivelactividaddesglose'));
        $this->hasColumn('idejercicio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ejecutado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estimado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('plan', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('proyeccion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idinversnivelactividad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idactividadentidad', 'numeric', null, array('notnull' => false, 'primary' => false));

    }

}

