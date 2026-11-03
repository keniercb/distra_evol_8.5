<?php 
abstract class BaseDatAccidenteimplicado extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstaccidente.dat_accidenteimplicado');
        $this->hasColumn(
            'idaccidenteimplicado',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstaccidente.sec_accidenteimplicado')
        );
        $this->hasColumn('idaccidente', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtipoinvalidez', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('tareahabitual', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('ffallecimiento', 'date', array('notnull' => false, 'primary' => false));
        $this->hasColumn('descfallecido', 'character varying', array('notnull' => false, 'primary' => false));
    }
}