<?php

/**
 * Created by PhpStorm.
 * User: Tony
 * Date: 24/10/2014
 * Time: 9:01
 */
abstract class BaseNomIndicadorcilindro extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.nom_indicadorcilindro');
        $this->hasColumn(
            'idindicador', 'numeric', null,
            array('notnull'  => true, 'primary' => true)
        );
        $this->hasColumn(
            'idusuario', 'numeric', null,
            array('notnull'  => true, 'primary' => false)
        );
        $this->hasColumn(
            'fecha', 'date', null,
            array('notnull'  => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
