<?php

abstract class BaseNomModulo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifplataforma.nom_modulo');

        $this->hasColumn(
            'idmodulo', 'numeric', null,
            array('notnull'  => false, 'primary' => true)
        );

        $this->hasColumn(
            'denominacion', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );

        $this->hasColumn(
            'uri', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );

        $this->hasColumn(
            'descripcion', 'character varying', null,
            array('notnull' => true, 'primary' => false)
        );

        $this->hasColumn(
            'instalado', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );

        $this->hasColumn(
            'integrado', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );

    }






}

