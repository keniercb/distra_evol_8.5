<?php

abstract class BaseNomVistacalendario extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.nom_vistacalendario');
        $this->hasColumn(
            'descripcion', 'character varying', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idvistacalendario', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
    }


}

