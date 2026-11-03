<?php

abstract class BaseDatServicio extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_servicio');
        $this->hasColumn(
            'idservicio', 'decimal', null, array(
                'ntype' => 'numeric',
                'alltypes' =>
                array(
                    0 => 'decimal',
                ),
                'notnull' => true,
                'primary' => true,
                'sequence' => 'sec_servicio',
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
            'wsdl', 'string', 255, array(
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
    }

}
