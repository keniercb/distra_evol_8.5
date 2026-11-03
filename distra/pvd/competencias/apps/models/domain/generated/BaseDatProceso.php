<?php 
abstract class BaseDatProceso extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_idoneidad.dat_proceso');
        $this->hasColumn(
            'idproceso', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_idoneidad.sec_proceso')
        );
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcomision', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructura', 'numeric', null, array('notnull' => true, 'primary' => false));
    }
}