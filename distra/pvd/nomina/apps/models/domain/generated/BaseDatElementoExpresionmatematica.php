<?php

abstract class BaseDatElementoExpresionmatematica extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_utiles.dat_elementoexpresionmatematica');
        $this->hasColumn('idelementoexpresionmatematica', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_utiles.sec_elementoexpresionmatematica'));
        $this->hasColumn('idexpresionmatematica', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('elemento', 'string', null, array('fixed' => false, 'notnull' => true, 'primary' => false));
        $this->hasColumn('valormostrar', 'string', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('tipoelemento', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idindicador', 'string', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('orden', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

}