<?php 
abstract class BaseDatAccidenteconclusion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstaccidente.dat_accidenteconclusiones');
        $this->hasColumn(
            'idaccidenteconclusion',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstaccidente.sec_accidenteconclusiones')
        );
        $this->hasColumn('idaccidente', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('conclusion', 'character varying', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fregistro', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idusuario', 'numeric', array('notnull' => true, 'primary' => false));
    }
}