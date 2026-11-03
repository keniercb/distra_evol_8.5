
<?php

abstract class BaseHisTrazasinversiones extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.his_trazasinversiones');
        $this->hasColumn('idtrazasinversiones', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_trazasinversiones'));
        $this->hasColumn('componente', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tabla', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idinversion', 'numeric', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('accion', 'character varying', 20, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'text', array('notnull' => false, 'primary' => false));
        $this->hasColumn('usuario', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fecha', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('inversion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructura', 'numeric', 255, array('notnull' => false, 'primary' => false));        
        $this->hasColumn('estructura', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'text', array('notnull' => false, 'primary' => false));        
    }
}

