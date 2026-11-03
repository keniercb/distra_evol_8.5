<?php 
abstract class BaseNomIndicadoramedir extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_capacitacion.nom_indicador');
        $this->hasColumn(
            'idindicador',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_capacitacion.sec_indicador')
        );
        $this->hasColumn('denominacion', 'character varying', array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', array('notnull' => false, 'primary' => false));
        $this->hasColumn('gestion', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('identidad', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idescala', 'numeric', array('notnull' => true, 'primary' => false));
    }
}