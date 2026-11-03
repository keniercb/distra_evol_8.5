<?php

abstract class BaseDatIndicadorfmpeir extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifintegracion.dat_indicadorfmpeir');
        $this->hasColumn('idindicadorfmpeir', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_planifintegracion.sec_indicadorfmpeir'));
        $this->hasColumn('idfuente', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array ('notnull' => true,'primary' => false));
    }


}

