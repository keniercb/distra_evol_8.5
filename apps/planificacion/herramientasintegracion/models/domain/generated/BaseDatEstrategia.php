<?php

abstract class BaseDatEstrategia extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifintegracion.dat_estrategia');
        $this->hasColumn('idestrategia', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_planifintegracion.sec_estrategia'));
        $this->hasColumn('idmatrizdofa', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idfactorclave1', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('idfactorclave2', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('idambitodofa', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('orden', 'smallint', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('experto', 'boolean', null, array ('notnull' => true,'primary' => false));
    }


}

