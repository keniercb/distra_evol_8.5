<?php
class BaseConfIdoneidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.conf_idoneidad');
        $this->hasColumn('idconfidoneidad', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_rrhhmaestro.sec_conf_idoneidad'));
        $this->hasColumn('idestructura', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('tipo', 'numeric', array('notnull' => true, 'primary' => false));
    }
}