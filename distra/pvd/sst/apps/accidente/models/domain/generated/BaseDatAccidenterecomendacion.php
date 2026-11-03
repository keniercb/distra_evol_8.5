<?php 
abstract class BaseDatAccidenterecomendacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstaccidente.dat_accidenterecomendacion');
        $this->hasColumn(
            'idaccidenterecomendacion',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstaccidente.sec_accidenterecomendacion')
        );
        $this->hasColumn('idaccidente', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('recomendacion', 'character varying', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fregistro', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idusuario', 'numeric', array('notnull' => true, 'primary' => false));
    }
}