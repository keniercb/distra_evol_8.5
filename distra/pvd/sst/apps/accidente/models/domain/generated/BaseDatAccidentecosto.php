<?php 
abstract class BaseDatAccidentecosto extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstaccidente.dat_accidentecosto');
        $this->hasColumn(
            'idaccidentecosto',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstaccidente.sec_accidentecosto')
        );
        $this->hasColumn('idaccidente', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', array('notnull' => true, 'primary' => false));
        $this->hasColumn('importe', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fregistro', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idusuario', 'numeric', array('notnull' => true, 'primary' => false));
    }
}