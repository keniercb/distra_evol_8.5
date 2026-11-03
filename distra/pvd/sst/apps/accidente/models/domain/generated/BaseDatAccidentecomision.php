<?php 
abstract class BaseDatAccidentecomision extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstaccidente.dat_accidentecomision');
        $this->hasColumn(
            'idaccidentecomision',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstaccidente.sec_accidentecomision')
        );
        $this->hasColumn('idaccidente', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcomision', 'numeric', array('notnull' => true, 'primary' => false));
    }
}