<?php

/*
 * Clase base de Recursos.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */

abstract class BaseDatRecurso extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_recurso');
        $this->hasColumn(
            'abreviatura',
            'character varying',
            255, 
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'icono', 
            'character varying',
            255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion',
            'character varying',
            255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion',
            'text',
            null, 
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idfuncionalidad',
            'numeric',
            null, 
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idrecurso',
            'numeric',
            null, 
            array(
                'notnull' => true,
                'primary' => true,
                'sequence' => 'mod_seguridad.sec_recurso'
            )
        );
        $this->hasColumn(
            'iddominio',
            'decimal',
            null, 
            array(
                'ntype' => 'numeric', 
                'alltypes' => array(0 => 'decimal',),
                'notnull' => true,
                'primary' => false,
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}