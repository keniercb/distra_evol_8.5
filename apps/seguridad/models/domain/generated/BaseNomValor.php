<?php

abstract class BaseNomValor extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_valor');
        $this->hasColumn(
            'idvalor', 'decimal', null, array(
            'ntype' => 'numeric',
            'alltypes' =>
            array(
                0 => 'decimal',
            ),
            'notnull' => true,
            'primary' => true,
            'sequence' => 'sec_valor',
            )
        );

        $this->hasColumn(
            'idfila', 'decimal', null, array(
            'ntype' => 'numeric',
            'alltypes' =>
            array(
                0 => 'decimal',
            ),
            'notnull' => false,
            'primary' => false,
            )
        );

        $this->hasColumn(
            'idcampo', 'decimal', null, array(
            'ntype' => 'numeric',
            'alltypes' =>
            array(
                0 => 'decimal',
            ),
            'notnull' => false,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'valor', 'string', 250, array(
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
