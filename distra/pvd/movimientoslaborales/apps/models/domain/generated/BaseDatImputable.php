<?php
abstract class BaseDatImputable extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_fuerzatrabajo.dat_imputable');
        $this->hasColumn(
            'idimputable',
            'numeric',
            null,
            array('notnull' => true,'primary' => true, 'sequence' => 'mod_fuerzatrabajo.sec_imputable')
        );
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true,'primary' => false));
        $this->hasColumn('idinterrupcion', 'numeric', null, array('notnull' => false,'primary' => false));
    }
}