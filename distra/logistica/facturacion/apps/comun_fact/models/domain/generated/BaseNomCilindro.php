<?php

/**
 * Created by PhpStorm.
 * User: Tony
 * Date: 24/10/2014
 * Time: 9:01
 */
abstract class BaseNomCilindro extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.nom_cilindro');
        $this->hasColumn(
            'idnomcilindro', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_logfacturacion.sec_nomcilindro')
        );
        $this->hasColumn(
            'denominacion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'estado', 'numeric', null,
            array('notnull' => true, 'primary' => false)
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
            'idumedida', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'capacidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }
}
