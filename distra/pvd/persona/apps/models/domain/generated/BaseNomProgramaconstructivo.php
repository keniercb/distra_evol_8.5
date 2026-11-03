<?php

abstract class BaseNomProgramaconstructivo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_fuerzatrabajo.nom_programalaboral');
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idprogramalaboral', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_programaconstructivo')
        );
    }

}

