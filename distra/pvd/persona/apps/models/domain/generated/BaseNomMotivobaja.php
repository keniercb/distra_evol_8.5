<?php

abstract class BaseNomMotivobaja extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_fuerzatrabajo.nom_motivobaja');
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpadre', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idmotivobaja', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_fuerzatrabajo.sec_motivobaja')
        );

    }

}