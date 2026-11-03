<?php

abstract class BaseDatMatrizfmpeir extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifintegracion.dat_matrizfmpeir');
        $this->hasColumn('idmatrizfmpeir', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_planifintegracion.sec_matrizfmpeir'));
        $this->hasColumn('idelementofuerzamotriz', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idestudiomatrizfmpeir', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('valor', 'text', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('orden', 'numeric', null, array ('notnull' => true,'primary' => false));
    }
}

