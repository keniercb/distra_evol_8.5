<?php

abstract class BaseDatGrupo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_persona.dat_grupo');
        $this->hasColumn('idgrupo', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_persona.sec_grupo'));
        $this->hasColumn('compartimentacion', 'text', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array ('notnull' => true,'primary' => false));
    }


}

