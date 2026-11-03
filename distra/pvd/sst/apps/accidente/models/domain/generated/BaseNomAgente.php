<?php 
abstract class BaseNomAgente extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstaccidente.nom_agente');
        $this->hasColumn(
            'idagente',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstaccidente.sec_agente')
        );
        $this->hasColumn('denominacion', 'character varying', array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtipoagente', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('gestion', 'numeric', array('notnull' => true, 'primary' => false));
    }
}