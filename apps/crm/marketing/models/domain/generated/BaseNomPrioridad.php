<?php

abstract class BaseNomPrioridad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmmarketing.nom_prioridad');
        $this->hasColumn('idprioridad', 'numeric', 19,array('notnull'  => true, 'primary' => true,'sequence' => 'mod_crmmarketing.sec_prioridad'));
        $this->hasColumn('denominacion', 'character varying', 255,array('notnull' => true, 'primary' => false));
    }

}