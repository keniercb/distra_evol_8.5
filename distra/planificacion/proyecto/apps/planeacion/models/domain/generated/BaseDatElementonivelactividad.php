<?php

abstract class BaseDatElementonivelactividad extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifintegracion.dat_elementonivelactividad');
        $this->hasColumn('idactividadentidad', 'numeric', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('idelemento', 'numeric', null, array('notnull' => false, 'primary' => false));      
        $this->hasColumn('nivelactividadelemento', 'numeric', null, array('notnull' => false, 'primary' => false));        
		$this->hasColumn('version', 'numeric', null, array('notnull' => false, 'primary' => false));
		$this->hasColumn('ajusteelemento', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}
