<?php

abstract class BaseNomCategoriasproducto extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.nom_categoria');
        $this->hasColumn(
            'idcategoria', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'sec_nomcategoria')
        );
        $this->hasColumn(
            'denominacion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'version', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'estado', 'numeric', 1, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'pordefecto', 'varchar', 0, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechafin', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechainicio', 'date', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}//fin clase

