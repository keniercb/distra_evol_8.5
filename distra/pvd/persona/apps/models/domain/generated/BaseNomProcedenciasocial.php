<?php

abstract class BaseNomProcedenciasocial extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_persona.nom_procedenciasocial');
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'descripcion', 'character varying', null, array(
                'notnull' => false, 'primary' => false, 'sequence' => 'Sin descripc')
        );
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idprocedenciasocial', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_persona.sec_procedenciasocial')
        );
    }

}

