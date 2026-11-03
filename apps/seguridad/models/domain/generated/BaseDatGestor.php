<?php

abstract class BaseDatGestor extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_gestor');
        $this->hasColumn(
            'idgestor', 'decimal', null, array(
                'ntype' => 'numeric',
                'alltypes' =>
                array(
                    0 => 'decimal',
                ),
                'notnull' => true,
                'primary' => true,
                'sequence' => 'sec_gestor',
            )
        );

        $this->hasColumn(
            'gestor', 'string', 50, array(
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
            'puerto', 'integer', 4, array(
                'ntype' => 'int4',
                'alltypes' =>
                array(
                    0 => 'integer',
                ),
                'unsigned' => false,
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