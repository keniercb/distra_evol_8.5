<?php
abstract class BaseNomDominio extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.nom_dominio');
        $this->hasColumn('iddominio', 'numeric', null, array ('notnull' => false,'primary' => true));
        $this->hasColumn('denominacion', 'character varying', null, array ('notnull' => false,'primary' => false));
    }
}