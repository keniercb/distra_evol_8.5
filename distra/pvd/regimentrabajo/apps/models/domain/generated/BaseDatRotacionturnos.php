<?php

abstract class BaseDatRotacionturnos extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_regimentrabajo.dat_rotacionturno');
        $this->hasColumn('idrotacionturno', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_rotacionturno'));
        $this->hasColumn('cantdias', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idrotacion', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idturnotrabajo', 'numeric', null, array ('notnull' => false,'primary' => false));
    }


}

