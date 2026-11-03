<?php

/**
 * Clase base del Nomenclador de Tema.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
abstract class BaseNomTema extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_tema');
        $this->hasColumn(
            'idtema', 'decimal', null, array(
            'ntype' => 'numeric',
            'alltypes' =>
            array(
                0 => 'decimal',
            ),
            'notnull' => true,
            'primary' => true,
            'sequence' => 'sec_tema',
            )
        );

        $this->hasColumn(
            'denominacion', 'string', 250, array(
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
            'abreviatura', 'string', 50, array(
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
            'descripcion', 'string', 250, array(
            'ntype' => 'varchar',
            'alltypes' =>
            array(
                0 => 'string',
            ),
            'fixed' => false,
            'notnull' => false,
            'primary' => false,
            )
        );
    }

}
