<?php 
abstract class BaseDatAccidentecausa extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstaccidente.dat_accidentecausa');
        $this->hasColumn(
            'idaccidentecausa',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstaccidente.sec_accidentecausa')
        );
        $this->hasColumn('idaccidente', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcausaaccidente', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', array('notnull' => false, 'primary' => false));
        $this->hasColumn('principal', 'numeric', array('notnull' => false, 'primary' => false));
    }
}