<?php

abstract class BaseDatServidorbd extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_seguridad.dat_servidorbd');
        $this->hasColumn(
            'idservidor', 'decimal', null, array(
                'ntype' => 'numeric',
                'alltypes' =>
                array(
                    0 => 'decimal',
                ),
                'notnull' => true,
                'primary' => true,
            )
        );
    }
}