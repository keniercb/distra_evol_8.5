<?php

abstract class BaseDatActorcaracterizado extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_actorfuente.dat_actorcaracterizado');
        $this->hasColumn('idactor', 'numeric', null, array ('notnull' => false,'primary' => true));
        $this->hasColumn('descripcion', 'text', null, array ('notnull' => true,'primary' => false));
    }


}

