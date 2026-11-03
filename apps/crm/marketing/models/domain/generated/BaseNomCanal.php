<?php

abstract class BaseNomCanal extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmmarketing.nom_canal');
        $this->hasColumn('idcanal', 'numeric', 19,array('notnull'  => true, 'primary' => true,'sequence' => 'mod_crmmarketing.sec_canal'));
        $this->hasColumn('denominacion', 'character varying', 255,array('notnull' => true, 'primary' => false));
    }

}
