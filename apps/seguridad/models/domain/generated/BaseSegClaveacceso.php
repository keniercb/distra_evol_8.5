<?php

/**
 * Clase base BaseSegClaveacceso.
 *
 * @name BaseSegClaveacceso
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
abstract class BaseSegClaveacceso extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('seg_claveacceso');
        $this->hasColumn(
            'idclaveacceso', 'decimal', null, array(
            'ntype' => 'numeric',
            'alltypes' =>
            array(
                0 => 'decimal',
            ),
            'notnull' => true,
            'primary' => true,
            'sequence' => 'sec_claveacceso',
            )
        );

        $this->hasColumn(
            'valor', 'boolean', 1, array(
            'ntype' => 'bool',
            'alltypes' =>
            array(
                0 => 'boolean',
            ),
            'notnull' => true,
            'primary' => false,
            )
        );

        $this->hasColumn(
            'fechainicio', 'date', null, array(
            'ntype' => 'date',
            'alltypes' =>
            array(
                0 => 'date',
            ),
            'notnull' => true,
            'primary' => false,
            )
        );

        $this->hasColumn(
            'fechafin', 'date', null, array(
            'ntype' => 'date',
            'alltypes' =>
            array(
                0 => 'date',
            ),
            'notnull' => true,
            'primary' => false,
            )
        );

        $this->hasColumn(
            'clave', 'string', 255, array(
            'ntype' => 'varchar',
            'alltypes' =>
            array(
                0 => 'string',
            ),
            'fixed' => false,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'idusuario', 'decimal', null, array(
            'ntype' => 'numeric',
            'alltypes' =>
            array(
                0 => 'decimal',
            ),
            'notnull' => true,
            'primary' => false,
            )
        );
    }

}
