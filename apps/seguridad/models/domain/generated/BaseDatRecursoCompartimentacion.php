<?php

/*
 * Clase base del dominio de Recursos.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */

abstract class BaseDatRecursoCompartimentacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_seguridad.dat_recursocompartimentacion');
        $this->hasColumn(
            'idrecurso',
            'decimal',
            null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'iddominio', 
            'decimal',
            null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}