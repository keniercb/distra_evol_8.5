<?php

abstract class BaseNomTipoConcepto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifplataforma.nom_tipoconcepto');

        $this->hasColumn(
            'idtipoconcepto', 'numeric', null,
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
            'incluido', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );

        $this->hasColumn(
            'idmodulo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );

    }


}

