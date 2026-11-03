<?php

abstract class BaseNomTipo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmmarketing.nom_tipo');
        $this->hasColumn('idtipo', 'numeric', 19,array('notnull'  => true, 'primary' => true,'sequence' => 'mod_crmmarketing.sec_tipo'));
        $this->hasColumn('denominacion', 'character varying', 255,array('notnull' => true, 'primary' => false));
    }

}