<?php

abstract class BaseNomIdioma extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_idioma');
        $this->hasColumn(
            'ididioma', 'decimal', null, array(
            'ntype' => 'numeric',
            'alltypes' =>
            array(
                0 => 'decimal',
            ),
            'notnull' => true,
            'primary' => true,
            'sequence' => 'sec_idioma',
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
            'abreviatura', 'string', 50, array(
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
