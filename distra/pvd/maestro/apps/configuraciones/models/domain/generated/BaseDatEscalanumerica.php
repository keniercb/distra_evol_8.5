<?php
class BaseDatEscalanumerica extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.dat_escalanumerica');
        $this->hasColumn('idescalanumerica', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_rrhhmaestro.sec_escalanumerica'));
        $this->hasColumn('idescala', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('valor', 'numeric', array('notnull' => true, 'primary' => false));
    }
}