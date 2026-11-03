<?php

/**
 * @name BaseDatAccion - Clase base de acciones.
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */

abstract class BaseDatAccion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_seguridad.dat_accion');
        $this->hasColumn(
            'idaccion', 
            'decimal', 
            null, 
            array(
                'ntype' => 'numeric', 
                'alltypes' => array(0 => 'decimal',),
                'notnull' => true,
                'primary' => true,
                'sequence' => 'mod_seguridad.sec_accion',
            )
        );
        $this->hasColumn(
            'denominacion', 
            'string',
            null, 
            array(
                'ntype' => 'text',
                'alltypes' => array(0 => 'string', 1 => 'clob',),
                'fixed' => false,
                'notnull' => true, 
                'primary' => false,
            )
        );
        $this->hasColumn(
            'descripcion',
            'string',
            null, 
            array(
                'ntype' => 'varchar',
                'alltypes' => array(0 => 'string',),
                'fixed' => false,
                'notnull' => false,
                'primary' => false,
            )
        );
        $this->hasColumn(
            'idfuncionalidad',
            'decimal',
            null,
            array(
                'ntype' => 'numeric', 
                'alltypes' => array(0 => 'decimal',),
                'notnull' => true,
                'primary' => false,
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
}