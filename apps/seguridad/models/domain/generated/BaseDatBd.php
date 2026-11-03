<?php

abstract class BaseDatBd extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_bd');
        $this->hasColumn(
            'idbd', 'decimal', null, array(
                'ntype' => 'numeric',
                'alltypes' =>
                array(
                    0 => 'decimal',
                ),
                'notnull' => true,
                'primary' => true,
                'sequence' => 'sec_bd',
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
    }

}