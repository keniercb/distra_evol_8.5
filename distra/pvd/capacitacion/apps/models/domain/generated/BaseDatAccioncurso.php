<?php
abstract class BaseDatAccioncurso extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_capacitacion.dat_accioncurso');
        $this->hasColumn(
            'idaccioncurso',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_capacitacion.sec_accioncurso')
        );
        $this->hasColumn('idaccion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcurso', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('frdesde', 'date', array('notnull' => false, 'primary' => false));
        $this->hasColumn('frhasta', 'date', array('notnull' => false, 'primary' => false));
        $this->hasColumn('profesor', 'character varying', null, array('notnull' => false, 'primary' => false));
    }
}