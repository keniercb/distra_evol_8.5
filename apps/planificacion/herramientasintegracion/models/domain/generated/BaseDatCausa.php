<?php

abstract class BaseDatCausa extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifintegracion.dat_causa');
        $this->hasColumn('idcausa', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifintegracion.sec_causa'));
        $this->hasColumn('idcategoria', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpadre', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('lft', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('rgt', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}
