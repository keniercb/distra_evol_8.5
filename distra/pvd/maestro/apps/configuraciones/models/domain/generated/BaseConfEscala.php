<?php
class BaseConfEscala extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.conf_escala');
        $this->hasColumn('idescala', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_rrhhmaestro.sec_escala'));
        $this->hasColumn('denominacion', 'character varying', array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', array('notnull' => false, 'primary' => false));
        $this->hasColumn('tipo', 'numeric', array('notnull' => true, 'primary' => false));
    }
}