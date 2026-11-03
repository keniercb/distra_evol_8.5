<?php

abstract class BaseDatElementofuerzamotriz extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifintegracion.dat_elementofuerzamotriz');
        $this->hasColumn('idelementofuerzamotriz', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_planifintegracion.sec_elementofuerzamotriz'));
        $this->hasColumn('idfuerzamotriz', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idelementopeir', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idindicadorfmpeir', 'numeric', null, array ('notnull' => false,'primary' => false));
    }


}

