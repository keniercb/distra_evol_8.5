<?php

abstract class BaseDatFactor extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifintegracion.dat_factor');
        $this->hasColumn('idfactor', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_planifintegracion.sec_factor'));
        $this->hasColumn('idmatrizdofa', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idfactorclave', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array ('notnull' => false,'primary' => false));
    }


}

