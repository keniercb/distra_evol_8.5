<?php

abstract class BaseDatSistema extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_sistema');
        $this->hasColumn(
            'idsistema', 'decimal', null, array(
                'ntype' => 'numeric',
                'alltypes' =>
                array(
                    0 => 'decimal',
                ),
                'notnull' => true,
                'primary' => true,
                'sequence' => 'sec_sistema',
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
            'idpadre', 'decimal', null, array(
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
            'denominacion', 'string', 255, array(
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
            'externa', 'string', 250, array(
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
            'lft',
            'decimal',
            null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'rgt', 
            'decimal',
            null,
            array('notnull' => false, 'primary' => false)
        );
    }
}