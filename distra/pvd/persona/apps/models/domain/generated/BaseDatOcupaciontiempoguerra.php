<?php

abstract class BaseDatOcupaciontiempoguerra extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_ocupaciontiempoguerra');
        $this->hasColumn('oficial', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('cargo', 'character varying', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('entidad', 'character varying', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idocupaciontiempoguerra', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_personaext.sec_ocupaciontiempoguerra'));
    }


}

