<?php
class BaseDatEscalacualitativa extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.dat_escalacualitativa');
        $this->hasColumn('idescalacualitativa', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_rrhhmaestro.sec_escalacualitativa'));
        $this->hasColumn('idescala', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idvalorcualitativo', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('peso', 'numeric', array('notnull' => true, 'primary' => false));
    }
}