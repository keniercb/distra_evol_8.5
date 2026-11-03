<?php 
abstract class BaseDatImplicadopartecuerpo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstaccidente.dat_implicadopartecuerpo');
        $this->hasColumn(
            'idimplicadopartecuerpo',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstaccidente.sec_implicadopartecuerpo')
        );
        $this->hasColumn('idaccidenteimplicado', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpartecuerpo', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idnaturalezalesion', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
    }
}