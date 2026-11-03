<?php

abstract class BaseNomOrganosatisface extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_organosatisface');
        $this->hasColumn(
            'idorganosatisface', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_datosmaestros.sec_organosatisface')
        );
        $this->hasColumn(
            'denominacion', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'color', 'character varying', 20,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'uriorganosatisface', 'character varying', 100,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idpadre', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nivelarbol', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'ordender', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'ordenizq', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idarbol', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase


