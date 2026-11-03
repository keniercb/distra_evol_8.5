<?php

abstract class BaseDatDestino extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_destino');
        $this->hasColumn(
            'idindicador', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idactividad', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
