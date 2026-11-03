<?php

abstract class BaseNomFila extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_fila');
        $this->hasColumn(
            'idfila', 'decimal', null, array(
            'ntype' => 'numeric',
            'alltypes' =>
            array(
                0 => 'decimal',
            ),
            'notnull' => true,
            'primary' => true,
            'sequence' => 'sec_fila',
            )
        );
        $this->hasColumn(
            'idusuario', 'decimal', null, array(
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
