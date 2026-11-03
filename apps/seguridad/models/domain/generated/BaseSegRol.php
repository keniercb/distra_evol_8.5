<?php

abstract class BaseSegRol extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_seguridad.seg_rol');
        $this->hasColumn(
            'idrol', 'decimal', null, array(
            'ntype' => 'numeric',
            'alltypes' =>
            array(
                0 => 'decimal',
            ),
            'notnull' => true,
            'primary' => true,
            'sequence' => 'sec_rol',
            )
        );

        $this->hasColumn(
            'denominacion', 'string', null, array(
            'ntype' => 'text',
            'alltypes' =>
            array(
                0 => 'string',
                1 => 'clob',
            ),
            'fixed' => false,
            'notnull' => true,
            'primary' => false,
            )
        );

        $this->hasColumn(
            'descripcion', 'string', 255, array(
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

        $this->hasColumn(
            'abreviatura', 'string', null, array(
            'ntype' => 'text',
            'alltypes' =>
            array(
                0 => 'string',
                1 => 'clob',
            ),
            'fixed' => false,
            'notnull' => false,
            'primary' => false,
            )
        );

        $this->hasColumn(
            'grupo', 'boolean', 1, array(
            'ntype' => 'bool',
            'alltypes' =>
            array(
                0 => 'boolean',
            ),
            'notnull' => false,
            'primary' => false,
            'default' => false,
            )
        );
    }

}
