<?php 
abstract class BaseDatAccidente extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstaccidente.dat_accidente');
        $this->hasColumn(
            'idaccidente',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstaccidente.sec_accidente')
        );
        $this->hasColumn('lugar', 'character varying', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtipoaccidente', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idformaaccidente', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idagente', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fecha', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('hora', 'character varying', array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fregistro', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('identidad', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('equiparado', 'numeric', array('notnull' => true, 'primary' => false));
    }
}