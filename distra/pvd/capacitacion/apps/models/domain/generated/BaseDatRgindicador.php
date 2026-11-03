<?php 
abstract class BaseDatRgindicador extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_capacitacion.dat_rgindicador');
        $this->hasColumn(
            'idrgindicador',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_capacitacion.sec_rgindicador')
        );
        $this->hasColumn('idreciengraduado', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idindicador', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fregistro', 'date', array('notnull' => true, 'primary' => false));
    }
}