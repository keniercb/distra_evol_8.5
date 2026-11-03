<?php 
abstract class BaseDatRgperiodo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_capacitacion.dat_rgperiodo');
        $this->hasColumn(
            'idrgperiodo',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_capacitacion.sec_rgperiodo')
        );
        $this->hasColumn('denominacion', 'character varying', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fdesde', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', array('notnull' => false, 'primary' => false));
        $this->hasColumn('idreciengraduado', 'numeric', array('notnull' => true, 'primary' => false));
    }
}