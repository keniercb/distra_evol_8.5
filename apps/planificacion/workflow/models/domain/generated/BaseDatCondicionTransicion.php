<?php

abstract class  BaseDatCondicionTransicion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_condiciontransicion');
        $this->hasColumn(
            'idcondicion', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idtransicion', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idautor', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechacreacion', 'date', null,
            array('notnull' => true, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }
}


