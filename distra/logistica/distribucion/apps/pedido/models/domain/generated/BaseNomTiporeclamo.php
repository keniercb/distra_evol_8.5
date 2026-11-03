<?php

abstract class BaseNomTiporeclamo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logdistribucion.nom_tiporeclamo');

        $this->hasColumn(
            'idtiporeclamo', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_logdistribucion.sec_nomtiporeclamo')
        );
        $this->hasColumn(
            'denominacion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'estado', 'character varying', 1,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechafin', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechainicio', 'date', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'generarpedido', 'character varying', 1,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}//fin clase

