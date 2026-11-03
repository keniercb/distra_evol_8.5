<?php

abstract class BaseDatCriterioestrategia extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifintegracion.dat_criterioestrategia');
        $this->hasColumn('idcriterio', 'numeric', null, array ('notnull' => false,'primary' => true));
        $this->hasColumn('idestrategia', 'numeric', null, array ('notnull' => false,'primary' => true));
    }


}

