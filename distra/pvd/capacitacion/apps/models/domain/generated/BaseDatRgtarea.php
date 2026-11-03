<?php 
abstract class BaseDatRgtarea extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_capacitacion.dat_rgtarea');
        $this->hasColumn(
            'idrgtarea',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_capacitacion.sec_rgtarea')
        );
        $this->hasColumn('idreciengraduado', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('tarea', 'character varying', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fregistro', 'date', array('notnull' => true, 'primary' => false));
    }
}