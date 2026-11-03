<?php 
abstract class BaseDatImplicadosubsidio extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstaccidente.dat_implicadosubsidio');
        $this->hasColumn(
            'idimplicadosubsidio',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstaccidente.sec_implicadosubsidio')
        );
        $this->hasColumn('idaccidenteimplicado', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', array('notnull' => true, 'primary' => false));
        $this->hasColumn('importe', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fregistro', 'date', array('notnull' => true, 'primary' => false));
    }
}