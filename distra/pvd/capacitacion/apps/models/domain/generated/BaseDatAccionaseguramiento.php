<?php 
abstract class BaseDatAccionaseguramiento extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_capacitacion.dat_accionaseguramiento');
        $this->hasColumn(
            'idaccionaseguramiento',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_capacitacion.sec_accionaseguramiento')
        );
        $this->hasColumn('idaccion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idaseguramiento', 'numeric', array('notnull' => true, 'primary' => false));
    }
}