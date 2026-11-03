<?php
abstract class BaseDatDominioestructuracontrol extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.dat_dominioestructuracontrol');
        $this->hasColumn('iddominio', 'numeric', null, array ('notnull' => false,'primary' => true));
        $this->hasColumn('idestructuracontrol', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idestructura', 'numeric', null, array ('notnull' => true,'primary' => false));
    }
}