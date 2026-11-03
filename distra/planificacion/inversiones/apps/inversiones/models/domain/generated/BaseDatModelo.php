<?php

abstract class BaseDatModelo extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('dat_modelo');
        $this->hasColumn(
                'idmodelo', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planificacion.sec_modelo')
        );
        $this->hasColumn('denominacion', 'character varying', 100, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fechaentrega', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('identidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idplan', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('balance', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtipomodelo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('uriruta', 'character varying', 2000, array('notnull' => false, 'primary' => false));
        $this->hasColumn('version', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}

//fin clase
?>

