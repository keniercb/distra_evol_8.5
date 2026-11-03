<?php 
abstract class BaseConflimites extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_capacitacion.conf_limites');
        $this->hasColumn('idlimite', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('denominacion', 'character varying', array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valor', 'numeric', array('notnull' => true, 'primary' => false));
    }
}