<?php

abstract class BaseDatEsquema extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_esquema');
        $this->hasColumn(
            'idesquema', 'decimal', null, array(
                'ntype' => 'numeric',
                'alltypes' =>
                array(
                    0 => 'decimal',
                ),
                'notnull' => true,
                'primary' => true,
                'sequence' => 'sec_esquema',
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
            'denominacion', 'string', 50, array(
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