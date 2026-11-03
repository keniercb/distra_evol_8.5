<?php
class BaseDatDominiocomision extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.dat_dominiocomision');
        $this->hasColumn('iddominio', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idcomision', 'numeric', array('notnull' => true, 'primary' => false));
    }
}