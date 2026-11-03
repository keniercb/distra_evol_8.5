<?php

abstract class BaseDatParametros extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_parametro');
        $this->hasColumn(
            'idparametro', 'decimal', null, array(
                'ntype' => 'numeric',
                'alltypes' =>
                array(
                    0 => 'decimal',
                ),
                'notnull' => true,
                'primary' => true,
                'sequence' => 'sec_parametro',
            )
        );

        $this->hasColumn(
            'tipoparametro', 'string', 250, array(
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
            'valordefecto', 'string', 250, array(
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
            'puedesernull', 'boolean', 1, array(
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
            'idfuncion', 'decimal', null, array(
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