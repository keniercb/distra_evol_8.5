<?php

abstract class BaseDatContenido extends BaseRecord
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_contenido');
        $this->hasColumn(
            'idtipocont', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcontenido', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'sec_contenido')
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}