<?php

abstract class BaseDatFuncionalidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_seguridad.dat_funcionalidad');
        $this->hasColumn(
            'idfuncionalidad', 'decimal', null, array(
                'ntype' => 'numeric',
                'alltypes' =>
                array(
                    0 => 'decimal',
                ),
                'notnull' => true,
                'primary' => true,
                'sequence' => 'sec_funcionalidad',
            )
        );

        $this->hasColumn(
            'index', 'integer', 4, array(
                'ntype' => 'int4',
                'alltypes' =>
                array(
                    0 => 'integer',
                ),
                'unsigned' => false,
                'notnull' => false,
                'default' => '0',
                'primary' => false,
            )
        );

        $this->hasColumn(
            'referencia', 'string', 255, array(
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
            'abreviatura', 'string', 255, array(
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
            'icono', 'string', 30, array(
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
            'idsistema', 'decimal', null, array(
                'ntype' => 'numeric',
                'alltypes' =>
                array(
                    0 => 'decimal',
                ),
                'notnull' => true,
                'primary' => false,
            )
        );

        $this->hasColumn(
            'iddominio', 'decimal', null, array(
                'ntype' => 'numeric',
                'alltypes' =>
                array(
                    0 => 'decimal',
                ),
                'notnull' => true,
                'primary' => false,
            )
        );

        $this->hasColumn(
            'visible', 'boolean', 1, array(
                'ntype' => 'bool',
                'alltypes' =>
                array(
                    0 => 'boolean',
                ),
                'notnull' => false,
                'default' => 'TRUE',
                'primary' => false,
            )
        );
    }

}