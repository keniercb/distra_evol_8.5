<?php

abstract class BaseNomTipomediocontacto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_persona.nom_tipomediocontacto');
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('abreviatura', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('type', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('maxcaracter', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('mincaracter', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idtipomediocontacto', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_persona.sec_tipomediocontacto')
        );
    }
}

