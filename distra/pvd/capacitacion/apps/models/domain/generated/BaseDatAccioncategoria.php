<?php
abstract class BaseDatAccioncategoria extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_capacitacion.dat_accioncategoria');
        $this->hasColumn(
            'idaccioncategoria',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_capacitacion.sec_accioncategoria')
        );
        $this->hasColumn('idaccion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcategoria', 'numeric', array('notnull' => true, 'primary' => false));
    }
}