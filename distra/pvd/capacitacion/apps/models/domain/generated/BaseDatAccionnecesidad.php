<?php 
abstract class BaseDatAccionnecesidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_capacitacion.dat_accionnecesidad');
        $this->hasColumn(
            'idaccionnecesidad',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_capacitacion.sec_accionnecesidad')
        );
        $this->hasColumn('idaccion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idnecesidad', 'numeric', array('notnull' => true, 'primary' => false));
    }
}