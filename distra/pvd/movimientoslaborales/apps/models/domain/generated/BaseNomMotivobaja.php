<?php 
abstract class BaseNomMotivobaja extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_fuerzatrabajo.nom_motivobaja');
        $this->hasColumn(
            'idmotivobaja',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_fuerzatrabajo.sec_motivobaja')
        );
        $this->hasColumn('idpadre', 'numeric', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('gestion', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fluctuacion', 'numeric', array('notnull' => true, 'primary' => false));
    }
}