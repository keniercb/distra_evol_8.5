<?php

abstract class BaseDatEstudiogantt extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifintegracion.dat_estudiogantt');
        $this->hasColumn('idestudiogantt', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_planifintegracion.sec_estudiogantt'));
        $this->hasColumn('idproyecto', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('nativo', 'boolean', null, array ('notnull' => false,'primary' => false));
    }


}

