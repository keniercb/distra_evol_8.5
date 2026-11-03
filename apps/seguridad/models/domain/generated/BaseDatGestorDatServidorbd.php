<?php

abstract class BaseDatGestorDatServidorbd extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_gestorservidorbd');
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
        
        $this->hasColumn(
            'idgestor', 'decimal', null, array(
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