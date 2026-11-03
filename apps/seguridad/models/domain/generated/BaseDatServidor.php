<?php

abstract class BaseDatServidor extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_seguridad.dat_servidor');
        $this->hasColumn(
            'idservidor', 'decimal', null, array(
                'ntype' => 'numeric',
                'alltypes' =>
                array(
                    0 => 'decimal',
                ),
                'notnull' => true,
                'primary' => true,
                'sequence' => 'sec_servidor',
            )
        );

        $this->hasColumn(
            'tiposervidor', 'string', 250, array(
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
            'ip', 'string', 50, array(
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