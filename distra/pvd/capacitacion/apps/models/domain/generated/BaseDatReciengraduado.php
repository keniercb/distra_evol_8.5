<?php 
abstract class BaseDatReciengraduado extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_capacitacion.dat_reciengraduado');
        $this->hasColumn(
            'idreciengraduado',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_capacitacion.sec_reciengraduado')
        );
        $this->hasColumn('idpersona', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idjefeinmediato', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtutor', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fdesde', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('tiempo', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhastass', 'date', array('notnull' => true, 'primary' => false));
    }
}