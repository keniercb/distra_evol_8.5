<?php

abstract class BaseNomTipoPartidagasto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_nomina.nom_tipopartidagasto');

        $this->hasColumn('fechafin', 'date', null, array (
            'notnull' => false,
            'primary' => false));

        $this->hasColumn('fechainicio', 'date', null, array(
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('descripcion', 'character varying', null, array(
            'notnull' => false,
            'primary' => false
        ));

        $this->hasColumn('denominacion', 'character varying', null, array(
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('idtipopartidagasto', 'numeric', null, array(
            'notnull' => true,
            'primary' => true,
            'sequence' => 'mod_nomina.sec_tipopartidagasto'
        ));

    }



}

