<?php 
abstract class BaseDatAccionn extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_capacitacion.dat_accion');
        $this->hasColumn(
            'idaccion',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_capacitacion.sec_accion')
        );
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idmodoformacion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fdesde', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('frdesde', 'date', array('notnull' => false, 'primary' => false));
        $this->hasColumn('frhasta', 'date', array('notnull' => false, 'primary' => false));
        $this->hasColumn('duracion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('lugar', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructura', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('curso', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('observacion', 'character varying', array('notnull' => true, 'primary' => false));
    }
}